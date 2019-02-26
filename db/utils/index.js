exports.formatDate = (array) => {
  const newArray = [...array];
  newArray.forEach((entry) => {
    entry.created_at = new Date(entry.created_at);
  });
  return newArray;
};

exports.renameKey = (array, oldName, newName) => {
  const newArray = [...array];
  newArray.forEach((element) => {
    element[newName] = element[oldName];
    delete element[oldName];
  });
  return newArray;
};

exports.createRef = (array, key_to_replace, new_key) => {
  const refObject = {};
  array.forEach((element) => {
    refObject[element[key_to_replace]] = element[new_key];
  });
  return refObject;
};

exports.formatData = (array, key_to_delete, new_key, refObj) => {
  const newArray = [...array];
  newArray.forEach((element, index) => {
    element[new_key] = refObj[newArray[index][key_to_delete]];
    delete element[key_to_delete];
  });
  return newArray;
};
