import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { from } from 'rxjs';
import { RequestService } from '../../../../services/request.service';
import { StorageService } from '../../../../services/storage.service';


interface ItemData {
  address: string;
  title: string;
  avatar: string;
  abstract: string;
  keyword:string;
  meeting_name: string;
  author:string;
}
@Component({
  selector: 'app-user-star',
  templateUrl: './user-star.component.html',
  styleUrls: ['./user-star.component.css']
})
export class UserStarComponent implements OnInit {
  public size: NzButtonSize = 'small';
  public page_index:any = 1;
  public page_size:any = 5;
  public page_total:any = 50;
  public data: ItemData[] = [];
  public star_articles_id:any[]=[];
  public noteVisible = false;
  public noteContent:any = ' ';
  public getNoteApi:string = 'http://47.96.231.121/auth/get_note';
  public updateNoteApi:string = 'http://47.96.231.121/auth/update_note';
  public noteIndex = 0;
  public userInfo:any;
  loadData(pi: number): void {
    this.data = new Array(5).fill({}).map((_, index) => {
      return {
        address: 'http://ant.design',
        title: `ant design part ${index} (page: ${pi})`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        abstract: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        meeting_name:
          'ECCV',
        keyword:"hello;world",
        author:`cold ${index}`
      };
    });
  }
  starApi:string = 'http://47.96.231.121/auth/get_star';
  delApi:string = 'http://47.96.231.121/auth/del_article';

  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  closeNote():void{
    console.log('更新note:'+this.noteContent);
    var data = {
      'user_id':this.storage.get('userInfo').userInfo.data.userid,
      'article_id':this.noteIndex,
      'note_info':this.noteContent
    };
    console.log(data);
    this.request.getData(this.updateNoteApi,data).then((response:any)=>{
      console.log(response);
    });

    this.noteVisible = false;
  }

  doNote(index:any){ 
    let article_id=this.storage.get("star_articles_id").slice((index-this.page_size));
    this.noteIndex = article_id[0];
    console.log(article_id[0]);
    var data = {
      'user_id':this.storage.get('userInfo').userInfo.data.userid,
      'article_id':article_id[0],
    };
    console.log(data);
    this.request.getData(this.getNoteApi,data).then((response:any)=>{
      console.log(response);
      console.log('返回note:'+response.data.note_info);
      this.noteContent = response.data.note_info;
      this.noteVisible = true;
    });
  }

  constructor(public request:RequestService,public storage:StorageService, public message:NzMessageService,public router:Router) { }

  ngOnInit(): void {
    //this.loadData(1);
    this.userInfo=this.storage.get("userInfo");
    if(this.userInfo!=null){
      this.getStarData();
    }
    else{
      this.message.error("你还未登录，为你跳转到登陆界面")
      this.router.navigate(['/user/login'])
    }
  }

  getStarData(){
    var data = {
        'user_id':this.storage.get('userInfo').userInfo.data.userid,
        'page_info':{
          'page_size':this.page_index,
          'page_num':this.page_size,
        }
    };
    console.log(data);
    this.request.getData(this.starApi,data).then((response:any)=>{
        console.log(response.data);
        var responseBody = response.data;
        this.page_total = responseBody.allPageNum;
        this.data = responseBody.data;
        
        //存入local storage
        if(this.page_total==0||this.data==[]){
          this.message.warning("你还没有收藏论文")
          this.data=[];
        }
        else{
          //存储id
          for (let index = 0; index < this.data.length; index++) {
            this.star_articles_id.push(response.data['data'][index]['id']);
          }
          this.storage.set("star_articles_id",this.star_articles_id);
        }
      });
  }

  
  getPageChangedData(){
    let result = this.page_total / this.page_index;
    let totalPage = result > Math.floor(result) ? Math.floor(result)+1 : Math.floor(result);
        // 当前是最后一页
    if (this.page_index == totalPage){
        let lastTotal = (totalPage - 1) * this.page_size;
        this.page_index=totalPage;
        this.page_size=this.page_total-lastTotal;
        console.log(this.page_index)

        this.getStarData();
    }
    // 当前不是最后一页
    else{
      console.log(this.page_index)
      
      this.getStarData();
    }
}

  delete(index:any){
    let article_id=this.storage.get("star_articles_id").slice((index-this.page_size));
    console.log(article_id[0]);
    var data = {
      'user_id':this.storage.get('userInfo').userInfo.data.userid,
      'article_id':article_id[0],
    };
    console.log(data);
    this.request.getData(this.delApi,data).then((response:any)=>{
      console.log(response);
    });
    this.storage.remove('star_articles_id');
    setTimeout(()=>{
      this.getPageChangedData();
    },2000);
  }

  

}
