import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found', {
      status: 404,
      data: { message: 'Contact not found' },
    });
  }

  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);

  return contact;
};

export const upsertContact = async (id, payload) => {
  const contact = await Contact.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found', {
      status: 404,
      data: { message: 'Contact not found' },
    });
  }

  return contact;
};

export const deleteContactById = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found', {
      status: 404,
      message: 'Contact not found',
      data: { message: 'Contact not found' },
    });
  }
};
