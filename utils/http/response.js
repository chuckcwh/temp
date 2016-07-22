export function json(request) {
  return new Promise((resolve, reject) => {
    request.then((response) => response.json())
    .then((data) => {
      resolve(data);
    })
    .catch((e) => {
      reject(e);
    });
  });
}

export function body(request) {
  return new Promise((resolve, reject) => {
    request.then((response) => response.body())
    .then((data) => {
      resolve(data);
    })
    .catch((e) => {
      reject(e);
    });
  });
}
