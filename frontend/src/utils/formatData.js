export function formatData(data) {
  const newData = {};
  newData.data = data.map((e, i) => {
    const arr = [];
    if (i === 0) {
      newData.header = Object.keys(e).filter((e) => e !== "created_at");
    }
    Object.keys(e).forEach((key) => {
      if (key == "created_at") {
        return;
      }
      arr.push(e[key]);
    });
    return arr;
  });
  return newData;
}
