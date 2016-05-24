export function json(request){
  return new Promise((resolve, reject)=>{
    request.then((response)=>{
      return response.json();
    })
    .then((json)=>{
      resolve(json);
    })
    .catch((e)=>{
      reject(e);
    });
  });
}

export function body(request){
  return new Promise((resolve, reject)=>{
    request.then((response)=>{
      return response.body();
    })
    .then((body)=>{
      resolve(body);
    })
    .catch((e)=>{
      reject(e);
    });
  });
}