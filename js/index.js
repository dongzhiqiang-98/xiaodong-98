class Goods{
    constructor(){
        Goods.list()
    }

    //获取商品信息
    //static  静态方法
    //静态方法只属于某个类
    static list(){
        //发送ajax请求
   axios.get('http://localhost/cart/server/server.php?fn=lst').then(res=>{
       //console.log(res);
       //将数据转化为对象
  let {meta,data}=JSON.parse(res);
  //console.log(meta,data);
  
  //判断请求的状态
  if(meta.status==200){
   // console.log(data);
   //data是数组对象，必须先循环
   let html = '';
   data.forEach(ele => {
 //console.log(ele);
 let {id,goodsName,price,goodsImg}=ele;
 html+=`<div class="box"><img src="${goodsImg}" alt=""><p>${goodsName}</p><span class="goods_item_price" data-price-id="100004222715" style="">¥${price}</span><a href="javascript:" id="InitCartUrl" class="btn-special1 btn-lg" onclick="Goods.addCart(${id},1)">加入购物车</a></div>`;
   });
   //追加到页面
   let app = document.querySelector('#cont');
   app.innerHTML=html;
  }
   });
   
    }
    //添加购物车方法
    static addCart(id,num){
    //  购物车逻辑，
    //1判断cart这个key是否存在
    //2存在就判断商品是否存在
    //2-1商品存在就增加数量
    //2-2商品不存在则新增
    //3 不存在则新增cart

    //获取cart
     let cartGoods = localStorage.getItem('cart');
     //判断cart是否存在
     if(cartGoods){
         cartGoods=JSON.parse(cartGoods);
       // 2-1判断商品是否存在
      // attr 就是存在的商品id  
      for(let attr in cartGoods){
           // 购物车中id,等于当前添加的id,商品存在
          if(attr==id){
             num+=cartGoods[id] 
          }
      }
        // 设置商品,商品存在就更新数量,不存在就新增
      
      cartGoods[id]=num;
      localStorage.setItem('cart',JSON.stringify(cartGoods))
     }else{//不存在
     //{商品id：数量}
     cartGoods = {[id]:num};
     cartGoods=JSON.stringify(cartGoods);
     localStorage.setItem('cart',cartGoods)
    
     }
    
    }
   
   
}

new Goods();