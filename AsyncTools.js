const AsyncTools = {
    
    to(promise) {
        return promise.then(data => {
            return [null, data];
        })
            .catch(err => [err]);
    },

    superFetch(url,payload=null){

          let fPromise=payload==null ? fetch(url) : fetch(url,payload);

          return new Promise((res,rej)=>{
            
            fPromise.then(r=>{
              
              if (r && r.ok===true){

                r.json().then(re=>{

                  res( [re,null] );
              
                })
                .catch(err=>res( [null,err] ));

              }else{
                res( [null,"No response, check your network connectivity"]);
              }

            })
            .catch(err=>{res( [null,err] );});
        });    
    }    
}

export default AsyncTools;