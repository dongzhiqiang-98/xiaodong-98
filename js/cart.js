class Cart{
    //静态方法声明在class中
    static checkOne;
    static all;
    constructor(){
        Cart.all = document.querySelectorAll('.check-all');
     Cart.list();
     Cart.checkOne = document.getElementsByClassName('check-one');
     Cart.checkAll();
    }
    //商品列表
    static list(){
        let goodsId=JSON.parse(localStorage.getItem('cart'));
      
         //后台需要goodsid以字符串形式穿递 str = '1,3,4,6';
         var goodsIdStr='';
         for(var id in goodsId){
          //console.log(id); 
          goodsIdStr+=id+ ','; 
         }
        // console.log(goodsIdStr);
        //发送ajax请求 获取数据
        axios.post('http://localhost/cart/server/cart.php?fn=lst','goodsId=' + goodsIdStr).then(res=>{
         
     let { meta, data } = JSON.parse(res);

       // 判断请求的状态
      if(meta.status==200){
          let html = '';
         data.forEach(goods => {
           
      let {id,goodsName,price,goodsImg}=goods   
      html+=`<tr>
      <td class="checkbox" >
        <input class="check-one check" onclick="Cart.chOne()" type="checkbox" />
    </td >
      <td class="goods">
        <img src="${goodsImg}" alt="" />
        <span>${goodsName}</span>
      </td>
      <td class="price">${price}</td>
      <td class="count">
        <span class="reduce"></span>
        <input class="count-input" type="text" value="${goodsId[id]}" />
        <span class="add" onclick="Cart.addGoodsNum(this,${id})">+</span>
      </td>
      <td class="subtotal">${(goodsId[id] * price).toFixed(2)}</td>
      <td class="operation">
        <span class="delete" onclick = "Cart.delGoods(this,${id})">删除</span>
      </td>
  </tr >`;
         });
         //追加到tbbody中
         let tbody=document.querySelector('tbody');
         tbody.innerHTML=html
      }
     
        });
        
    }
    //全选实现
    static checkAll(){
     Cart.all[0].addEventListener('click',Cart.allEvent);
     Cart.all[1].addEventListener('click', Cart.allEvent);
    }
   //全选事件方法
   static allEvent(){
    //获取全选状态
 
    let check = this.checked;
   // 获取所有的单选按钮,让它跟随全选的状态
   Array.from(Cart.checkOne).forEach(ele=>{
       ele.checked=check
   })
   //设置另一个全选跟随状态
   Cart.all[0].checked=check;
   Cart.all[1].checked=check;
//统计商品数量
Cart.goodscount();
}
//单选操作
  static chOne(){
    //获取单个商品数量
   
     let goodslen=Cart.checkOne.length;
     let count = 0;
     //统计选中状态的个数
     Array.from(Cart.checkOne).forEach(ele=>{
       if(ele.checked) count++;
     })
     //判断选中的个数是否等于商品个数
     let checkSta=false;
     if(goodslen==count){
       checkSta=true;
     }
     //设置全选按钮的状态
     Cart.all[0].checked=checkSta;
     Cart.all[1].checked=checkSta;
     Cart.goodscount();
  }
  //数量和价格的统计
  static goodscount(){
    //统计商品数量
    let count = 0;
    let price = 0;
    //统计选中的单选按钮对应的商品数量
    Array.from(Cart.checkOne).forEach(ele=>{
      if(ele.checked){
       let trobj = ele.parentNode.parentNode;
       let goodsNum=trobj.getElementsByClassName('count-input')[0].value-0;
       count += goodsNum;
      // console.log(goodsNum);
   //3 获取小计
   let xj = trobj.getElementsByClassName('subtotal')[0].innerHTML-0;
   price+=xj;
      
      }
    })
   // console.log(count,price);
   //放到已选商品和合计
   let totalobj = document.getElementById('selectedTotal');
   let priceobj=document.getElementById('priceTotal');
   totalobj.innerHTML=count;
   priceobj.innerHTML=price.toFixed(2)
  }

  static clickStatus=true;
//商品数量的改变
  static addGoodsNum(that,id){
    //设计延时器，防止过快点击
    if(!Cart.clickStatus) return
    Cart.clickStatus=false;
    setTimeout(()=>{
      Cart.clickStatus=true
    },500)
    //console.log(that);
    //获取原有的数量
    let numobj = that.previousElementSibling
    let num = numobj.value-0;
    num++
    numobj.value=num;
    //console.log(num);
    //更新local中的商品的数量
    let CartGoods=JSON.parse(localStorage.getItem('cart'));
    CartGoods[id]=num;
    localStorage.setItem('cart',JSON.stringify(CartGoods));
    //更新数量和统计
    Cart.goodscount();
    //更新数小计
    let trobj=this.parentNode.parentNode;
    //获取价格
    let oneP = trobj.getElementsByClassName('price')[0].innerHTML;
    trobj.getElementsByClassName('subtotal')[0].innerHTML=(oneP*num).toFixed(2)
  }
 /***删除的实现**/
 static delGoods(that,id){
   that.parentNode.parentNode.remove();
   //更新local
   let CartGoods=JSON.parse(localStorage.getItem('cart'));
   //删除属性
   delete CartGoods[id];
   localStorage.setItem('cart',JSON.stringify(CartGoods));
   Cart.goodscount();
 }
}
new Cart();