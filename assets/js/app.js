
const cl = console.log;

const baseUrl = `https://my-project-410e0-default-rtdb.asia-southeast1.firebasedatabase.app`;

const postUrl = `${baseUrl}/posts.json`

const postContainer = document.getElementById("postContainer")
const postForm = document.getElementById("postForm")
const titleControl = document.getElementById("title")
const contentControl = document.getElementById("content")
const submitbtn = document.getElementById("submitbtn")
const updateBtn = document.getElementById("updateBtn")



const templating = (arr) =>{
    let result = '';
    arr.forEach(ele => {
        result +=`
        <div class="card col-md-6 offset-md-3 text-center  mt-4 p-0" id="${ele.id}">
            <div class="card-header card-temp-h">
                <h3>${ele.title}</h3>
            </div>
            <div class="card-body">
                <p>${ele.content}</p>
            </div>
            <div class="card-footer card-temp-h d-flex justify-content-between">
                <button class="btn btn-warning" type="button" onClick='onEditBtn(this)'>Edit</button>
                <button class="btn btn-danger" type="button" onClick='onDeleteBtn(this)'>Delete</button>
            </div>
    </div>
                `;
    });
    postContainer.innerHTML = result;
}


const objToArray = (obj) =>{
    let arr = [];
    for (const key in obj){
        arr.push({id:key, ...obj[key]})
    }
    return arr;
}


const makeApiCall = (methodName, apiUrl, msgbody) =>{
    
    return fetch(apiUrl,{
        method : methodName,
        body : msgbody,
        header : {
            "auth": "Barear JWT Token",
            // "Content-Type" : "application/json"
        }   
    })
    
    .then(res=>{
        
    return res.json();
    })
}

makeApiCall('GET',postUrl)
.then(data=>{
    cl(data)
    let arr = objToArray(data);
    templating(arr)
    loader.classList.add('d-none')
})
.catch(err=>{
    cl(err)
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
})
.finally(()=>{
    loader.classList.add('d-none')
})

const oncreatePost = (eve) =>{
    eve.preventDefault();
    let obj = {
        title : titleControl.value,
        content : contentControl.value
    }
    
makeApiCall("POST",postUrl, JSON.stringify(obj))
.then(res=>{
    cl(res)
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Post Created Successfully!!!',
        showConfirmButton: true,
        timer: 2000
      })
    let card = document.createElement('Div')
    card.id = res.name;
    card.className = 'card mt-4 col-md-6 offset-md-3 p-0 text-center';
    card.innerHTML+= ` 
    <div class="card-header card-temp-h">
    <h3>${obj.title}</h3>
</div>
<div class="card-body">
    <p>${obj.content}</p>
</div>
<div class="card-footer d-flex justify-content-between card-temp-h">
    <button class="btn btn-warning" type="button" onClick='onEditBtn(this)'>Edit</button>
    <button class="btn btn-danger" type="button" onClick='onDeleteBtn(this)'>Delete</button>
</div>
     
    `;
   postContainer.prepend(card)
   loader.classList.remove('d-none')
})
.catch(err=>{
    cl(err)
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    
})
.finally(()=>{
    postForm.reset();
    loader.classList.add('d-none')
})   
}


const onEditBtn =(e) =>{
    let editId =e.closest('.card').id; 
    cl(editId)
    localStorage.setItem('editId', editId)
    let editUrl =`${baseUrl}/posts/${editId}.json`
cl(editUrl)
    makeApiCall("GET", editUrl)
    .then(res=>{
        cl(res)
        titleControl.value = res.title;
        contentControl.value = res.content;
        loader.classList.remove('d-none')
    })
    .catch(err=>{
        cl(err)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
    })
    .finally(()=>{
        submitbtn.classList.add('d-none')
        updateBtn.classList.remove('d-none')
        loader.classList.add('d-none')
        
    })
}



updateBtn.addEventListener('click', (e)=>{
    let updateId = localStorage.getItem('editId')
    cl(updateId)
    let updateUrl = `${baseUrl}/posts/${updateId}.json`
    cl(updateUrl)
    let obj = {
        title : titleControl.value,
        content : contentControl.value
    }
    cl(obj)
    makeApiCall('PATCH',updateUrl, JSON.stringify(obj))
    .then(res=>{
        cl(res)
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Post Updated Successfully!!!',
            showConfirmButton: true,
            timer: 2000
          })
        let card = [...document.getElementById(updateId).children]
        card[0].innerHTML=`<h3>${res.title}</h3>`
        card[1].innerHTML=`<p>${res.content}</p>`
    })
    .catch(err=>{
        cl(err)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
    })
    .finally(()=>{
        submitbtn.classList.remove('d-none')
        updateBtn.classList.add('d-none')
        postForm.reset();
        loader.classList.add('d-none')
    })

})

const onDeleteBtn = (e) =>{
    let deleteId = e.closest('.card').id;
    let deleteUrl = `${baseUrl}/posts/${deleteId}.json`
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(result=>{
        if(result.isConfirmed){
            makeApiCall("DELETE", deleteUrl)
            .then(res=>{
                cl(res)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Post Deleted Successfully!!!',
                    showConfirmButton: true,
                    timer: 2000
                  })
                let deleteCard = document.getElementById(deleteId).remove();
                loader.classList.add('d-none')
            })
        }
      })
 
    .catch(err=>{
        cl(err)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
    })
   
    
}

postForm.addEventListener('submit',oncreatePost)