<template>
    <div style="padding: 20px;">
        <el-form :model="queryForm" ref="queryForm" :rules="formRules" :inline="true" style="text-align: left;padding: 5px;line-height: 36px;height: 36px" @submit.native.prevent>
            <el-form-item label="专业" prop="pro">
                <el-input v-model="queryForm.pro" placeholder="请输入专业"></el-input>
            </el-form-item>
            <el-form-item label="班级" prop="cls">
                <el-input v-model="queryForm.cls" placeholder="请输入班级"></el-input>
            </el-form-item>
            <el-form-item label="学期" prop="period">
                <period-input v-on:periodSubmit="periodSubmit"></period-input>
            </el-form-item>
            <el-button type="primary" @click="queryCourse('queryForm')">查询</el-button>
        </el-form>
        <course-list :courses="this.courses" :is-join="isJoin"></course-list>
    </div>
</template>
<script>
    import global  from 'common'
    import http from 'http'
    import co from 'co'
    import periodComponent from '../components/period-input.vue'
    import courseListComponent from '../components/course-list.vue'
    export default{
        components:{
            'period-input':periodComponent,
            'course-list':courseListComponent
        },
        data(){
            var checkCls = (rule,value,cb)=>{
                if(!value){
                    cb(new Error('班级名称不能为空'));
                }else{
                    cb();
                }
            }
            var checkPro = (rule,value,cb)=>{
                if(!value){
                    cb(new Error('专业名称不能为空'));
                }else{
                    cb();
                }
            }
            var checkPeriod=(rule,value,cb)=>{
                if(!value){
                    cb(new Error('请选择学期'));
                }else{
                    cb();
                }
            }
            return {
                queryForm:{
                    pro:this.$store.state.user.pro,
                    cls:this.$store.state.user.cls,
                    period:global.getCurrentPeriod()
                },
                formRules:{
                    pro:[{validator:checkPro,trigger:'blur'}],
                    cls:[{validator:checkCls,trigger:'blur'}],
                    period:[{validator:checkPeriod,trigger:'blur'}]
                },
                isJoin:true,
                courses:[]
            }
        },
        methods:{
            queryCourse(formName){
                this.$refs[formName].validate((valid)=>{
                    if(valid){
                        var url = `/api/course/pro/${this.queryForm.pro}/cls/${this.queryForm.cls}/period/${this.queryForm.period}`;
                        co(function *() {
                            var result = yield http.getJson(url);
                            return result;
                        }).then(result=>{
                            this.courses = result;
                        }, err => {
                            if(err && typeof err ==='object' &&err.statusCode){
                                if(err.statusCode===1){
                                    this.$message.error(err.message);
                                }else if(err.statusCode===401){
                                    this.$router.replace({name:'login'});
                                }
                            }else{
                                this.$message.error(err);
                            }
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                })
            },
            periodSubmit(msg){
                this.queryForm.period = msg;
            }
        }
    }
</script>
