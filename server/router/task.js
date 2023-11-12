import Task from "../model/task";
import Users from "../model/users";
import { basename } from "path";
import formidable from "formidable";
import config from "../src/config";
import { join } from "path";
import mongoose from "mongoose"
const express = require("express");
const router = express.Router();
let fs = require("fs");

router.post("/add", async (req, res) => {
  let { create_time, name, credit, desc, update_time, target_id, owner_id } =
    req.body;
  let result = await Task.create({
    create_time,
    credit,
    desc,
    update_time,
    target_id,
    owner_id,
    name,
  });
  if (result) {
    return res.json({
      code: 0,
      msg: "添加任务成功",
    });
  } else {
    return res.json({
      code: -1,
      msg: "添加任务失败",
    });
  }
});
router.get("/list", async (req, res) => {
  const { keyWord, isDone } = req.query;
  const reg = new RegExp(keyWord, "i");
  let queryQuote = {
    name: { $regex: reg },
  };
  console.log(typeof isDone,isDone);
  try {
    let tasks = await Task.aggregate([
      {
        $match: { name: { $regex: keyWord, $options: "i" }, isDone: isDone === 'true' },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "target_id",
          foreignField: "_id",
          as: "target",
        },
      },
    ]);
    console.log(tasks);
    if (tasks) {
      setTimeout(()=> {
        return res.json({
          tasks: tasks,
          msg: "获取资料成功",
          code: 0,
        });
      }, 3000)
    } else {
      return res.json({
        code: -1,
        msg: "获取资料失败",
      });
    }
  } catch (e) {
    res.json({
      msg: e.message || e,
      code: -1,
    });
  }
});
router.get("/detail", async (req, res) => {
  const { _id } = req.query;
 
  console.log(_id);
  try {
    let tasks = await Task.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "target_id",
          foreignField: "_id",
          as: "target",
        },
      },
    ]);
    console.log(tasks);
    if (tasks) {
      return res.json({
        task: tasks[0],
        msg: "获取资料成功",
        code: 0,
      });
    } else {
      return res.json({
        code: -1,
        msg: "获取资料失败",
      });
    }
  } catch (e) {
    res.json({
      msg: e.message || e,
      code: -1,
    });
  }
});
router.post("/delete", async (req, res) => {
  const { _id } = req.body;
  try {
    let tasks = await Task.deleteOne({ _id });
    console.log(tasks);
    if (tasks.ok === 1) {
      return res.json({
        msg: "删除资料成功",
        code: 0,
      });
    } else {
      return res.json({
        code: -1,
        msg: "删除资料失败",
      });
    }
  } catch (e) {
    res.json({
      msg: e.message || e,
      code: -1,
    });
  }
});
router.post("/complete", async (req, res) => {
  const { _id } = req.body;
  try {
    let tasks = await Task.find({ _id });

    if (tasks.length) {
      await Task.updateOne({ _id }, {isDone: true});
      return res.json({
        msg: "保存成功",
        code: 0,
      });
    } else {
      return res.json({
        code: -1,
        msg: "保存失败",
      });
    }
  } catch (e) {
    res.json({
      msg: e.message || e,
      code: -1,
    });
  }
});
router.post("/upload", (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.uploadDir = join(config.publicPath, "/Task");
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      const fileCover = "/Task/" + basename(files.fileCover.path);
      const zipFile = "/Task/" + basename(files.zipFile.path);
      const { fileTitle, fileDesc } = fields;
      const newTask = new Task({
        fileDesc,
        fileTitle,
        fileCoverUrl: fileCover,
        zipFileUrl: zipFile,
      });
      const result = await Task.create(newTask);
      if (result._id) {
        res.json({
          code: 0,
          msg: "成功",
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.json({
      code: 0,
      msg: e.message || e,
    });
  }
});
router.post("/changeAvatar", (req, res) => {
  let form = new formidable.IncomingForm();
  form.uploadDir = config.publicPath;
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    let imageUrl = basename(files.file.path);
    let userId = fields.userId;
    let newUser = await Users.updateOne({ _id: userId }, { cover: imageUrl });
    res.json({
      newUser,
    });
  });
});
// router.post('/addTag',async (req,res) =>{
//     let { articleID,tagName} = req.body
//     let tag = await Tag.find({tagName:tagName})
//     if(tag.length){
//         tag[0].articleIDs.push(articleID)
//         tag[0].save();
//         return res.json({
//             code:0,
//             msg:'文章已添加标签'
//         })
//     }else{
//         let TempTag = Tag.create({tagName,articleIDs:[articleID]})
//         if (TempTag) {
//             res.json({
//                 code:0,
//                 msg:'添加新标签成功'
//             })
//         }else {
//             res.json({
//                 code: -1,
//                 msg:'添加新标签失败'
//             })
//
//         }
//     }
//
// })
router.get("/getAllImage", async (req, res) => {
  var files = await fs.readdirSync("public");

  files.shift();
  res.json({
    imageList: files,
  });
});
module.exports = router;
