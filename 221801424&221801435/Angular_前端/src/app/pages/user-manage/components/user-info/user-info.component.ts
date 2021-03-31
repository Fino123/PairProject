import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import {StorageService} from '../../../../services/storage.service';
import {RequestService} from '../../../../services/request.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})

export class UserInfoComponent implements OnInit {
  public Value:any;
  public api:string = 'http://47.96.231.121/auth/update_infos';
  public User:any={
    name:'cold',
    password:'123456',
    school:'FZU',
    gender:"男"
  }
  public userInfo:any;

  constructor(public storage:StorageService,public request:RequestService,public message:NzMessageService,private router: Router,) { }

  ngOnInit(): void {
    this.userInfo=this.storage.get("userInfo");
    if(this.userInfo!=null){
      console.log(this.userInfo['userInfo']['data'])
      this.getInfo(this.userInfo['userInfo']['data']['userid'])
    }
    else{
      this.message.error("你还未登录，为你跳转到登陆界面")
      this.router.navigate(['/user/login'])
    }
   
  }

  userInfoUpdate():void{

    var data = {
      'user_id':this.storage.get('userInfo').userInfo.data.userid,
      'user_list':[
        this.User.name,
        this.User.password,
        '',
        '',
        this.User.school,
        '',
        this.User.gender,
      ],
    };
    // console.log(data);
    this.request.getData(this.api,data).then((response:any)=>{
      if(response['status']==200){
        this.message.success("修改成功")
      }
      else{
        this.message.error("修改失败")
      }
      console.log(response);
    });
  }
  getInfo(id:any){
    this.request.getData('http://47.96.231.121/auth/get_userInfo',{'user_id':id}).then((data:any)=>{
      if(data.status==200){
        console.log(data)
        this.User.name=data['data']['user_name']
        this.User.password=data['data']['password']
        this.User.gender=data['data']['user_gender']
        this.User.school=data['data']['school']
        
      }
      else{
        this.message.error("请求失败，请刷新重试");
      }
      
    })
  }

  

}
