/**
 * Created by SiuWongLi on 17/3/29.
 * 页面路由相关
 * 2017-04-26 14:24:35
 * 此部分代码硬编码太多,变化太多，有bad code 的味道，后面作项目整理时一齐整理
 */
import NotFound from '../../pages/NotFound404.vue'  //404
import Login from '../../pages/Login.vue'  // 登录注册页面
import Retrieve from '../../pages/RetrievePwd.vue' //找回密码
import Main from '../../pages/Main.vue'    // 主页面
import App from '../../App.vue'            //App负载页面
import MPW from '../../pages/ModifyPw.vue' // 修改密码
import UserInfo from '../../pages/UserInfo.vue'
import Course from '../../pages/Courses.vue'
import NewCourse from '../../pages/NewCourse.vue'
import Lessons from '../../pages/Lessons.vue'
import NewLesson from '../../pages/NewLesson.vue'
import joinCourse from '../../pages/JoinClass.vue'
import Lesson from '../../pages/Lesson.vue'
import Applicants from '../../pages/Applicants.vue'
import Activity  from '../../pages/MyActivity.vue'
import Notice from '../../pages/Notices.vue'
import Statistic from '../../pages/Statistics.vue'
import UserDedail from '../../pages/UserDetail.vue'

// 引入状态管理
import store from '../../store'
var isStudent = store.state.user.type==='1';
var CourseBeforeEnter =(to,from,next)=>{
    var path = new Array();
    path.push({path:to.path,name:to.name,label:`${isStudent?'首页':'课程管理'}`});
    store.commit('storePath',path);
    next();
}
var MPWBeforeEnter = (to,from,next)=>{
    var path = new Array();
    path.push({path:to.path,name:to.name,label:'修改密码'});
    store.commit('storePath',path);
    next();
}
var UserInfoBeforeEnter = (to,from,next)=>{
    var path = new Array();
    path.push({path:to.path,name:to.name,label:'个人信息'});
    store.commit('storePath',path);
    next();
}
var PatchCourseBeforeEnter =(to,from,next)=>{
    var path = new Array();
    path.push({path:'courses',name:'courseManage',label:'课程管理'});
    path.push({path:'patchCourse',name:'patchCourse',label:'课程信息修改'});
    store.commit('storePath',path);
    next();
}
var NewCourseBeforeEnter = (to,from,next)=>{
    var path = new Array();
    path.push({path:'courses',name:'courseManage',label:'课程管理'});
    path.push({path:'newCourse',name:'newCourse',label:'发布新课程'});
    store.commit('storePath',path);
    next();
}
var LessonManageBeforeEnter = (to,from,next)=>{
    var path = new Array();
    if(isStudent){
        path.push({path:'courses',name:'courseManage',label:'首页'});
    }else{
        path.push({path:'courses',name:'courseManage',label:'课程管理'});
    }
    path.push({path:'lessons/:cid',name:'lessonManage',label:'课堂管理'});
    store.commit('storePath',path);
    next();
}
var NewLessonBeforeEnter = (to,from,next)=>{
    var path = new Array();
    path.push({path:'courses',name:'courseManage',label:'课程管理'});
    path.push({path:'lessons/:cid',name:'lessonManage',label:'课堂管理'});
    path.push({path:'newLesson/:cid',name:'newLesson',label:'发布新课堂'});
    store.commit('storePath',path);
    next();
}
var JoinCourseBeforeEnter = (to,from,next)=>{
    var path = new Array();
    path.push({path:'join',name:'joinCourse',label:'加入班级'});
    store.commit('storePath',path);
    next();
}

var LessonBeforeEnter =(to,from,next)=>{
    var path = new Array();
    if(isStudent){
        path.push({path:'courses',name:'courseManage',label:'首页'});
    }else{
        path.push({path:'courses',name:'courseManage',label:'课程管理'});
    }
    path.push({path:'lessons/:cid',name:'lessonManage',label:'课堂管理'});
    path.push({path:'lesson/:lid',name:'lesson',label:'课堂详情'});
    store.commit('storePath',path);
    next();
}
var UserDetailBeforeEnter =(to,from,next)=>{
    var path = new Array();
    if(isStudent){
        path.push({path:'courses',name:'courseManage',label:'首页'});
    }else{
        path.push({path:'courses',name:'courseManage',label:'课程管理'});
        path.push({path:'lessons/:cid',name:'lessonManage',label:'课堂管理'});
    }
    path.push({path:'lesson/:lid',name:'lesson',label:'课堂详情'});
    path.push({path:'detail/:uid',name:'userdetail',label:'用户详情'});
    store.commit('storePath',path);
    next();
}
var ApplicantBeforeEnter = (to,from,next)=>{
    var path = new Array();
    path.push({path:'courses',name:'courseManage',label:'课程管理'});
    path.push({name:'applicants',path:'applicants/:cid',label:'班级申请列表'});
    store.commit('storePath',path);
    next();
}
var MyActivityBeforeEnter= (to,from,next)=>{
    var path = new Array();
    path.push({path:'activity',name:'myActivity',label:'我的动态'});
    store.commit('storePath',path);
    next();
}
var NoticeBeforeEnter= (to,from,next)=>{
    var path = new Array();
    path.push({path:'notice',name:'notice',label:'我的消息'});
    store.commit('storePath',path);
    next();
}
var StatisticBeforeEnter= (to,from,next)=>{
    var path = new Array();
    path.push({path:'statistic',name:'statistic',label:'统计分析'});
    store.commit('storePath',path);
    next();
}
export default [{
    path: '/',
    component: App,
    children: [
        {
            name:'login',
            path: '/login', // 登录
            meta: { requiresAuth: false },
            component: Login
        },
        {
            name:'retrieve',
            path:'retrieve',//找回密码
            meta:{requiresAuth: false},
            component: Retrieve
        },
        {
            name:'index',
            path: '/ets', // 主界面
            meta: { requiresAuth: true },
            component: Main,
            children:[
                {path:'',component:Course,beforeEnter:CourseBeforeEnter},  //默认进入页
                {name:'courseManage',path:'courses',component:Course,beforeEnter:CourseBeforeEnter}, //课程管理页
                {name:'modifyPw',path:'modifyPw',component:MPW,beforeEnter:MPWBeforeEnter}, //修改密码
                {name:'userInfo',path:'userInfo',component:UserInfo,beforeEnter:UserInfoBeforeEnter}, //个人信息
                {name:'patchCourse',path:'patchCourse/:cid',component:NewCourse,beforeEnter:PatchCourseBeforeEnter}, //课程修改
                {name:'newCourse',path:'newCourse',component:NewCourse,beforeEnter:NewCourseBeforeEnter}, //添加课程
                {name:'lessonManage',path:'lessons/:cid',component:Lessons,beforeEnter:LessonManageBeforeEnter}, //课堂管理
                {name:'newLesson',path:'newLesson/:cid',component:NewLesson,beforeEnter:NewLessonBeforeEnter}, //新课堂发布
                {name:'joinCourse',path:'join',component:joinCourse,beforeEnter:JoinCourseBeforeEnter}, //加入班级
                {name:'lesson',path:'lesson/:lid',component:Lesson,beforeEnter:LessonBeforeEnter},  //课堂详细信息
                {name:'applicants',path:'applicants/:cid',component:Applicants,beforeEnter:ApplicantBeforeEnter},  //班级申请列表
                {name:'myActivity',path:'activity',component:Activity,beforeEnter:MyActivityBeforeEnter},  //班级申请列表
                {name:'notice',path:'notice',component:Notice,beforeEnter:NoticeBeforeEnter},  //我的消息
                {name:'statisic',path:'statisic',component:Statistic,beforeEnter:StatisticBeforeEnter},  //统计分析
                {name:'userdetail',path:'detail/:uid',component:UserDedail,beforeEnter:UserDetailBeforeEnter},  //统计分析
            ]
        },
        {
            name:'notfound',
            path: '*', // 其他页面
            redirect: '/login'
        },
        // {
        //     name:'notfound',
        //     path:'/404',
        //     meta: { requiresAuth: false },
        //     component:NotFound
        // }
    ]
}]
