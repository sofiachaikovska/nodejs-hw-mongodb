const parseBoolean = (unknown) => {
  if (!['true', 'false'].includes(unknown)) return;

  return unknown === 'true' ? true : false;
};

export const parseFilters = (query) => {
  return {
    contactType: query.contactType,
    isFavourite: parseBoolean(query.isFavourite),
  };
};
