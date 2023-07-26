const isEqualDate = (a, b) => {
  const date_a = new Date(a);
  const date_b = new Date(b);

  try {
    if (
      date_a.getFullYear() === date_b.getFullYear() &&
      date_a.getMonth() === date_b.getMonth() &&
      date_a.getDate() === date_b.getDate()
    ) {
      return true;
    }
  } catch (e) {
    throw new Error("Compare Date", e);
  }

  return false;
};

export const getCopyList = async (keyword = undefined, date = undefined) => {
  try {
    const { copyList } = await chrome.storage.sync.get("copyList");

    if (!copyList) {
      return [];
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
  } catch (e) {
    throw new Error("Get Category", e);
  }
};

export const deleteCopyItem = async (copyList, id) => {
  try {
    const filteredCopyList = copyList.filter((item) => item.id !== id);
    await updateCopyList(filteredCopyList);

    return filteredCopyList;
  } catch (e) {
    throw new Error("Delete Category", e);
  }
};

export const updateCopyList = async (copyList) => {
  try {
    await chrome.storage.sync.set({ copyList });
  } catch (e) {
    throw new Error("Update Category", e);
  }
};
