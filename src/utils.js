const isEqualDate = (a, b) => {
  if (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  ) {
    return true;
  }

  return false;
};

export const getCopyList = async (keyword = undefined, date = undefined) => {
  const { copyList } = await chrome.storage.sync.get("copyList");

  if (!copyList) {
    throw new Error("Error Get CopyList");
  }

  if (keyword === undefined && date === undefined) {
    return copyList;
  }

  if (keyword && date === undefined) {
    return copyList.filter(({ text }) => String(text).includes(keyword));
  }

  if (date && keyword === undefined) {
    return copyList.filter((item) => {
      const copiedDate = new Date(item.date);
      return isEqualDate(copiedDate, date);
    });
  }

  return copyList
    .filter(({ text }) => String(text).includes(keyword))
    .filter((item) => {
      const copiedDate = new Date(item.date);
      return isEqualDate(copiedDate, date);
    });
};

export const deleteCopyItem = async (copyList, id) => {
  const filteredCopyList = copyList.filter((item) => item.id !== id);
  await updateCopyList(filteredCopyList);

  return filteredCopyList;
};

export const updateCopyList = async (copyList) => {
  await chrome.storage.sync.set({ copyList });
};
