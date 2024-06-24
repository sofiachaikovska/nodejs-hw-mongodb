import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';
import { saveToCloudinary } from '../utils/saveToCloudinary.js';

const createPaginationInformation = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
  userId,
}) => {
  const skip = perPage * (page - 1);

  const contactsFilters = Contact.find({ userId });

  if (filter.contactType) {
    contactsFilters.where('contactType').equals(filter.contactType);
  }

  if (typeof filter.isFavourite === 'boolean') {
    contactsFilters.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsFilters).countDocuments(),
    Contact.find()
      .merge(contactsFilters)
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationInformation = createPaginationInformation(
    page,
    perPage,
    contactsCount,
  );

  return {
    contacts,
    ...paginationInformation,
  };
};

export const getContactById = async (id, userId) => {
  const contact = await Contact.findById({ _id: id, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found', {
      status: 404,
      data: { message: 'Contact not found' },
    });
  }

  return contact;
};

export const createContact = async ({ photo, ...payload }, userId) => {
  let url;

  if (photo) {
    url = await saveToCloudinary(photo);
  }

  const contact = await Contact.create({ ...payload, userId, photo: url });

  return contact;
};

export const upsertContact = async (id, { photo, ...payload }, userId) => {
  let url;

  if (photo) {
    url = await saveToCloudinary(photo);
  }

  const contact = await Contact.findByIdAndUpdate(
    { _id: id, userId },
    { ...payload, ...(url && { photo: url }) },
    {
      new: true,
    },
  );

  if (!contact) {
    throw createHttpError(404, 'Contact not found', {
      status: 404,
      data: { message: 'Contact not found' },
    });
  }

  return contact;
};

export const deleteContactById = async (contactId, userId) => {
  const contact = await Contact.findByIdAndDelete({ _id: contactId, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found', {
      status: 404,
      message: 'Contact not found',
      data: { message: 'Contact not found' },
    });
  }
};
