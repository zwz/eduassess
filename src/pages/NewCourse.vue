<template>
    <el-card class="box-card" v-loading="loading"
             element-loading-text="正在上传数据……">
        <el-form label-width="80px" :model="courseForm" :label-position="labelPosition" ref="courseForm"
                 :rules="formRules">
            <el-form-item prop="name" label="课程名称">
                <el-input v-model="courseForm.name"/>
            </el-form-item>
            <el-form-item prop="pro" label="专业">
                <el-input v-model="courseForm.pro"/>
            </el-form-item>
            <el-form-item prop="cls" label="班级">
                <el-input v-model="courseForm.cls"/>
            </el-form-item>
            <el-form-item prop="period" label="学期">
                <el-input v-model="courseForm.period" :disabled="true"/>
            </el-form-item>
            <div>
                <el-button class="item-button" type="primary" @click="onSubmit('courseForm')">确定</el-button>
                <el-button class="item-button" type="primary" @click="onReset('courseForm')">重置</el-button>
            </div>
        </el-form>
    </el-card>
</template>
<script>
    import http from 'http';
    import global from 'common';
    import co from 'co';
    export default{
        data(){
            var checkName = (rule, value, cb) => {
                if (value === '') {
                    cb(new Error('请输入课程名称'));
                } else {
                    cb();
                }
            }
            var checkPro = (rule, value, cb) => {
                if (value === '') {
                    cb(new Error('请输入专业'));
                } else {
                    cb();
                }
            }
            var checkCls = (rule, value, cb) => {
                if (value === '') {
                    cb(new Error('请输入班级'));
                } else {
                    cb();
                }
            }
            return {
                labelPosition: 'right',
                loading:false,
                submited:false,
                formType:'post',
                storeUser:this.$store.state.user,
                courseForm: {
                    name: '',
                    period: '',
                    pro: '',
                    cls: '',
                    uid:'',
                },
                formRules: {
                    name: [{validator: checkName, trigger: 'blur'}],
                    pro: [{validator: checkPro, trigger: 'blur'}],
                    cls: [{validator: checkCls, trigger: 'blur'}],
                }
            }
        },
        created(){
            if(this.$route.params.cid){
                this.fetchData();
                this.formType='put';
            }else{
                this.courseForm.period = global.getCurrentPeriod();
                this.courseForm.pro = this.$store.state.user.pro;
                this.formType='post';
            }
        },
        watch:{
            course:function () {
                //当表单数据改变时，设置提交状态为false
                this.submited =false;
            }
        },
        methods: {
            fetchData(){
                var url =`/api/course/${this.$route.params.cid}`;
                co(function *() {
                    var result = yield http.getJson(url);
                    return result;
                }).then(result=>{
                    if(result.length>0){
                        var course = result[0];
                        this.courseForm.name=  course.name;
                        this.courseForm.pro=  course.pro;
                        this.courseForm.cls=  course.cls;
                        this.courseForm.period=  course.period;
                        console.log("result:",course.tname);
                        this.courseForm.tname  =course.tname;
                        this.courseForm.uid  =course.uid;
                    }
                },err=>{
                    this.$message.error(err);
                }).catch(err=>{
                    this.$message.error(err);
                })

            },
            onSubmit(formName){
                if(this.storeUser.name===''){
                    this.$alert('您的信息还未完善，请完善后再进行课程添加哦','提示',{
                        confirmButtonText:'前往个人信息页面',
                        callback:(action)=>{
                            this.$router.push({name:'userInfo'});
                        }
                    })
                    return ;
                }
                if(this.submited){
                    this.$message.warning('您的信息没有任何改变哦');
                    return;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.formType==='post'){
                            this.postData();
                        }else if(this.formType==='put'){
                            this.putData();
                        }
                    }

                })
            },
            onReset(formName){
                this.$refs[formName].resetFields();
                this.courseForm.period = global.getCurrentPeriod();
            },
            putData(){
                this.loading = true;
                var url = `/api/course/${this.$route.params.cid}`;
                var course= this.course;
                co(function *() {
                    var result = yield http.putJson(url,course);
                    return result;
                }).then((result)=>{
                    this.loading = false;
                    this.submited =true;
                    this.$alert('修改成功','提示',{
                        confirmButtonText:'确定',
                        callback:(action)=>{
                            this.$router.go(-1);
                        }
                    })
                }, err => {
                    this.loading = false;
                    if(err && typeof err ==='object' &&err.statusCode){
                        if(err.statusCode===1){
                            this.$message.error(err.message);
                        }else if(err.statusCode===401){
                            this.$router.replace({name:'login'});
                        }
                    }else{
                        this.$message.error(err);
                    }
                }).catch((err)=>{
                    this.loading = false;
                    console.log(err);
                })
            },
            postData(){
                this.loading = true;
                var url = '/api/course';
                var course= this.course;
                co(function *() {
                    var result= yield http.postJson(url,course);
                    return result;
                }).then((value)=>{
                    this.loading = false;
                    this.submited =true;
                    this.$alert('发布成功','提示',{
                        confirmButtonText:'确定',
                        callback:(action)=>{
                            this.$router.go(-1);
                        }
                    })
                },(err)=>{
                    this.loading = false;
                    if(err && typeof err ==='object' &&err.statusCode){
                        if(err.statusCode===1){
                            this.$message.error(err.message);
                        }else if(err.statusCode===401){
                            this.$router.replace({name:'login'});
                        }
                    }else{
                        this.$message.error(err);
                    }
                }).catch((err)=>{
                    this.loading = false;
                    console.log(err);
                })
            }
        },
        computed: {
            course: {
                get: function () {
                    var formData = new FormData();
                    formData.append('name', this.courseForm.name); //课程名称
                    formData.append('cls', this.courseForm.cls); //班级名称
                    formData.append('pro', this.courseForm.pro); //专业名称
                    formData.append('period', this.courseForm.period); //学期
                    var uid = this.courseForm.uid|| this.$store.state.user.uid;
                    formData.append('uid', uid); //教师id
                    var tname = this.courseForm.tname|| this.$store.state.user.name;
                    formData.append('tname',tname); //教师名称
                    return formData;
                }
            }
        }
    }
</script>
<style>
    .box-card {
        width: 480px;
    }
</style>