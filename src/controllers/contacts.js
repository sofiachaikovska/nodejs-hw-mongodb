import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  upsertContact,
} from '../services/contacts.js';
import { parseFilters } from '../utils/parseFilters.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = req.query;
  const filter = parseFilters(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const contactId = req.params.contactId;
  const contact = await getContactById(contactId, req.user._id);

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { body } = req;
  const contact = await createContact(body, req.user._id);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { body } = req;
  const { contactId } = req.params;
  const contact = await upsertContact(contactId, body, req.user._id);

  res.status(200).json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res) => {
  const id = req.params.contactId;
  await deleteContactById(id, req.user._id);

  res.status(204).send();
};
