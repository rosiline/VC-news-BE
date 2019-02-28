exports.formatDate = array => array.map((originalElement) => {
  const element = { ...originalElement };
  element.created_at = new Date(element.created_at);
  return element;
});

exports.renameKey = (array, oldName, newName) => array.map((originalElement) => {
  const element = { ...originalElement };
  element[newName] = element[oldName];
  delete element[oldName];
  return element;
});

exports.createRef = (array, key_to_replace, new_key) => {
  const refObject = {};
  array.forEach((element) => {
    refObject[element[key_to_replace]] = element[new_key];
  });
  return refObject;
};

exports.formatData = (array, key_to_delete, new_key, refObj) => array.map((originalElement, index) => {
  const element = { ...originalElement };
  element[new_key] = refObj[array[index][key_to_delete]];
  delete element[key_to_delete];
  return element;
});
