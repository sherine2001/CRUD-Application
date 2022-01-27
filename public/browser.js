function itemTemplate(item)
{
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button  data-id ="${item._id}"class="edit-me btn btn-secondary btn-sm">Edit</button>
      <button  data-id ="${item._id}" class="delete-me btn btn-danger btn-sm" >Delete</button>
    </div>
  </li>`
}


//Initial Page Load Render
let ourHTML=items.map(function(item){
      return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend",ourHTML)

//Create Feature
let CreateField=document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit",function(e){
       e.preventDefault()

       axios.post('/create-item',{text:CreateField.value}).then(function(response)
       {
            
            document.getElementById("item-list").insertAdjacentHTML("beforeend",itemTemplate(response.data))
             CreateField.value=""
             CreateField.focus()

       }).catch(err=>{
           console.log(err)
       })
   


   }
)


document.addEventListener('click',function(e)
{
    if(e.target.classList.contains('edit-me')){
        let userinput=prompt("enter your desired new text")
        if(userinput)
        {
            axios.post('/update-item',{text: userinput ,id : e.target.getAttribute('data-id')}).then(function()
            {
               
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML=userinput
    
            }).catch()
        }
   

}




        if(e.target.classList.contains('delete-me')){
               
           
                axios.post('/delete-item',{id : e.target.getAttribute('data-id')}).then(function()
                {
                   
                    e.target.parentElement.parentElement.remove();
        
                }).catch(err=>{
                    console.log(err)
                })
            
       

            }
})
