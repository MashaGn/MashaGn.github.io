$(() => {
  //Добавление объектов
  $.event.addProp('dataTransfer');
  let total_items=0;
  $.get('https://kodaktor.ru/cart_data.json', (data) => {
    Object.keys(data).forEach((key, i) => {
      $('#item_container').append(`
      <div class="item" id="no${i}" draggable="true" >
        <img src="img/${key}.png" draggable="false">
        <label class="title">${key}</label>
        <span class="cur"><label class="price"> ${data[key]}</label>$</span>
      </div>`);
     });
  $(`.item`).on('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
    });
  $('#cart_items').on(`dragover` , (e) => e.preventDefault());
  $('#cart_items').on(`drop`, (e) => {
    const id = e.dataTransfer.getData('text/plain');
    addItem(id);
    });

    //Расчет бюджета
   function addItem(id){
     const i = id[2];
     const bdg= $('input').val();
     const price = Number($(`#${id} .price`).text());
    if(bdg>=price){
       const title = $(`#${id} .title`).text();
       let html = `
          <div class="item" id="${i}">
          <a class="remove" id="${price}">&times</a>
            <center><img src="img/${title}.png"></center>
            <label class="title">${title}</label>
            <span class="cur"><center><label class="price">${price}</label>$</center></span>
          </div>`
     $('#cart_items').append(html);
      total_items+=1;
      let cprice=bdg-price;
      $("#citem").text(total_items);
      $("#cprice").val(cprice);
     }
    else{
      alert('Недостаточно средств')
      return false;
    }
  }
     //Удаление товара из корзины
    $('body').on("click", "a.remove", function(){
      const price =  Number(this.id);
      $(this).closest("div.item").animate({opacity: 0}, 1000, function() {$(this).remove()});
      total_items--;
      const bdg = Number($('input').val());
      const cprice=bdg+price;
      $("#cprice").val(cprice);
      $("#citem").text(total_items);
       });
 });

// Очищаем корзину
 $("#btn_clear").click(function() {
            $("#cart_items").fadeOut("2000", function() {
               $(this).html("").fadeIn("fast")
            });
            $("#citem").html("0");
            $("#cprice").val(100);
            total_items = 0;
            return false;
  });
});
