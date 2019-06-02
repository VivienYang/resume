!function(){
    let model = {
        //初始化
        init:function(){
            var APP_ID = 'uIQT5JXoPdHEPMqCzad2vOe8-gzGzoHsz';
            var APP_KEY = 'P5pS899uPr2lEMbFgEPLfcSu';
            AV.init({
                appId: APP_ID,
                appKey: APP_KEY
            });            
        },
        //获取数据
        fetch:function(){
            let query = new AV.Query('Todo');
            return query.find()
        },
        //保存数据
        save:function(user_name,user_message){
            var Todo = AV.Object.extend('Todo');
            var todo = new Todo();
            // 只要添加这一行代码，服务端就会自动添加这个字段
            todo.set('user_name', user_name);
            todo.set('user_message', user_message);
            return todo.save()
        }

    }
    let view = document.querySelector('#siteMessage')
    let controller = {
        model:null,
        view:null,
        messageList:null,
        myForm:null,
        init:function(){
            this.model=model
            this.view=view
            this.model.init()
            this.messageList=view.querySelector('.messageList')
            this.myForm=view.querySelector('.myForm')
            this.loadMessage()
            this.listenSaveMessage()
        },
        loadMessage:function(){//加载留言数据
            let that=this
            this.model.fetch().then(function (messages) {
              // 成功获得实例
              console.log(messages)
              messages.forEach(mess => {
                  console.log(mess)
                  let message = mess.attributes
                  let liElement=document.createElement('li')
                  liElement.innerText=`${message.user_name}:${message.user_message}`
                  that.messageList.appendChild(liElement)
              });
            }, function (error) {
                console.log(error)
            }).then(function(succ){

            },function(err){
                console.log(err)
            });
        },
        listenSaveMessage:function(){
            let myForm = this.myForm
            let messageList = this.messageList
            myForm.addEventListener('submit',(e)=>{
                e.preventDefault();
                let user_name=myForm.querySelector('input.user_name').value||''
                let user_message=myForm.querySelector('input.user_message').value||''
                if(user_name.length==0){
                    alert('用户名不能为空')
                    return
                }
                if(user_message.length==0){
                    alert('留言不能为空')
                    return
                }
                this.model.save(user_name,user_message).then(function (todo) {
                  // 成功保存之后，执行其他逻辑.
                  let liElement=document.createElement('li')
                  liElement.innerText=`${user_name}:${user_message}`
                  messageList.appendChild(liElement)
                  myForm.querySelector('input.user_message').value=''
                }, function (error) {
                  // 异常处理
                  alert('保存失败')
                }).then(function(succ){

                },function(err){
                    console.log(err)
                });
            })
        }
    }
    controller.init(view, model)
}.call()