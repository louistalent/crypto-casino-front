"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const Register = joi_1.default.object({
    firstname: joi_1.default.string().max(36).required(),
    lastname: joi_1.default.string().max(36).required(),
    country: joi_1.default.string().max(36).required(),
    username: joi_1.default.string().max(36).required(),
    currency: joi_1.default.string().max(5).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required()
});
const Login = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    ipAddress: joi_1.default.string().optional()
});
const createUser = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().max(36).required(),
    country: joi_1.default.string().max(36).required(),
    firstName: joi_1.default.string().max(36).required(),
    lastName: joi_1.default.string().max(36).required(),
    currency: joi_1.default.string().max(36).required(),
    password: joi_1.default.string().min(6).required(),
    roleId: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
    avatarUrl: joi_1.default.string()
});
const userId = joi_1.default.object().keys({
    userId: joi_1.default.string().required()
});
const deleteUser = joi_1.default.object().keys({
    userId: joi_1.default.number().required()
});
const updateUser = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().max(36).required(),
    country: joi_1.default.string().max(36).required(),
    firstName: joi_1.default.string().max(36).required(),
    lastName: joi_1.default.string().max(36).required(),
    currency: joi_1.default.string().max(36).required(),
    password: joi_1.default.string().min(6).required(),
    roleId: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
    birthdate: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    avatarUrl: joi_1.default.string()
});
const createRole = joi_1.default.object({
    name: joi_1.default.string().max(36).required(),
    slug: joi_1.default.string().max(36).required()
});
const roleId = joi_1.default.object().keys({
    roleId: joi_1.default.string().required()
});
const updateRole = joi_1.default.object({
    name: joi_1.default.string().max(36).required(),
    slug: joi_1.default.string().max(36).required()
});
const customerId = joi_1.default.object().keys({
    customerId: joi_1.default.string().required()
});
const createCustomer = joi_1.default.object({
    primaryEmail: joi_1.default.string().required(),
    secondaryEmail: joi_1.default.string().allow(''),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    birthday: joi_1.default.date().required(),
    primaryAddress: joi_1.default.string().required(),
    secondaryAddress: joi_1.default.string().allow(''),
    primaryContact: joi_1.default.string().required(),
    secondaryContact: joi_1.default.string().allow(''),
    city: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    foundUs: joi_1.default.string().allow(''),
    about: joi_1.default.string().allow(''),
    serviceNeeded: joi_1.default.array().items(joi_1.default.string()),
    avatarUrl: joi_1.default.string().allow('')
});
const updateCustomer = joi_1.default.object({
    primaryEmail: joi_1.default.string().required(),
    secondaryEmail: joi_1.default.string().allow(''),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    birthday: joi_1.default.date().required(),
    primaryAddress: joi_1.default.string().required(),
    secondaryAddress: joi_1.default.string().allow(''),
    primaryContact: joi_1.default.string().required(),
    secondaryContact: joi_1.default.string().allow(''),
    city: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    foundUs: joi_1.default.string().allow(''),
    about: joi_1.default.string().allow(''),
    serviceNeeded: joi_1.default.array().items(joi_1.default.string()),
    avatarUrl: joi_1.default.string().allow('')
});
const createInvoice = joi_1.default.object({
    dueDate: joi_1.default.date().required(),
    taxes: joi_1.default.number().required(),
    status: joi_1.default.string().max(8).required(),
    createDate: joi_1.default.date().required(),
    discount: joi_1.default.number().required(),
    totalAmount: joi_1.default.number().required(),
    invoiceNumber: joi_1.default.string().required(),
    items: joi_1.default.array()
        .items(joi_1.default.object({
        title: joi_1.default.string().required(),
        price: joi_1.default.number().min(0).required(),
        total: joi_1.default.number().min(0),
        service: joi_1.default.string().allow(''),
        quantity: joi_1.default.number().min(0).required(),
        description: joi_1.default.string().allow('')
    }))
        .required(),
    invoiceFrom: joi_1.default.object(),
    invoiceTo: joi_1.default.object(),
    isDraft: joi_1.default.boolean().required()
});
const updateInvoice = joi_1.default.object({
    dueDate: joi_1.default.date().required(),
    taxes: joi_1.default.number().required(),
    status: joi_1.default.string().max(8).required(),
    createDate: joi_1.default.date().required(),
    discount: joi_1.default.number().required(),
    totalAmount: joi_1.default.number().required(),
    invoiceNumber: joi_1.default.string().required(),
    items: joi_1.default.array()
        .items(joi_1.default.object({
        title: joi_1.default.string().required(),
        price: joi_1.default.number().min(0).required(),
        total: joi_1.default.number().min(0),
        service: joi_1.default.string().allow(''),
        quantity: joi_1.default.number().min(0).required(),
        description: joi_1.default.string().allow('')
    }))
        .required(),
    invoiceFrom: joi_1.default.object(),
    invoiceTo: joi_1.default.object(),
    isDraft: joi_1.default.boolean().required()
});
const invoiceId = joi_1.default.object().keys({
    invoiceId: joi_1.default.string().required()
});
const remove = joi_1.default.object().keys({
    ids: joi_1.default.array().items(joi_1.default.string()).required()
});
const removeTask = joi_1.default.object().keys({
    ids: joi_1.default.array().items(joi_1.default.string()).required()
});
const createEstimate = joi_1.default.object({
    dueDate: joi_1.default.date().required(),
    taxes: joi_1.default.number().required(),
    status: joi_1.default.string().max(8).required(),
    createDate: joi_1.default.date().required(),
    discount: joi_1.default.number().required(),
    totalAmount: joi_1.default.number().required(),
    estimateNumber: joi_1.default.string().required(),
    isTemplate: joi_1.default.boolean(),
    items: joi_1.default.array()
        .items(joi_1.default.object({
        id: joi_1.default.string().optional(),
        title: joi_1.default.string().required(),
        price: joi_1.default.number().min(0).required(),
        total: joi_1.default.number().min(0),
        service: joi_1.default.string().allow(''),
        quantity: joi_1.default.number().min(0).required(),
        description: joi_1.default.string().allow('')
    }))
        .required(),
    estimateFrom: joi_1.default.object(),
    estimateTo: joi_1.default.object(),
    isDraft: joi_1.default.boolean().required()
});
const updateEstimate = joi_1.default.object({
    dueDate: joi_1.default.date().required(),
    taxes: joi_1.default.number().required(),
    status: joi_1.default.string().max(8).required(),
    createDate: joi_1.default.date().required(),
    discount: joi_1.default.number().required(),
    totalAmount: joi_1.default.number().required(),
    estimateNumber: joi_1.default.string().required(),
    isTemplate: joi_1.default.boolean(),
    items: joi_1.default.array()
        .items(joi_1.default.object({
        title: joi_1.default.string().required(),
        price: joi_1.default.number().min(0).required(),
        total: joi_1.default.number().min(0),
        service: joi_1.default.string().allow(''),
        quantity: joi_1.default.number().min(0).required(),
        description: joi_1.default.string().allow('')
    }))
        .required(),
    estimateFrom: joi_1.default.object(),
    estimateTo: joi_1.default.object(),
    isDraft: joi_1.default.boolean().required()
});
const estimateId = joi_1.default.object().keys({
    estimateId: joi_1.default.string().required()
});
const createTask = joi_1.default.object({
    name: joi_1.default.string().min(1).required(),
    status: joi_1.default.string().required(),
    priority: joi_1.default.string().required(),
    customer: joi_1.default.object().required(),
    subcontractors: joi_1.default.array().required(),
    description: joi_1.default.string().min(1).required(),
    durations: joi_1.default.object().required(),
    services: joi_1.default.array().required()
});
const updateTask = joi_1.default.object({
    name: joi_1.default.string(),
    status: joi_1.default.string(),
    priority: joi_1.default.string(),
    customer: joi_1.default.object(),
    subcontractors: joi_1.default.array(),
    description: joi_1.default.string().allow(''),
    durations: joi_1.default.object().required(),
    services: joi_1.default.array().required()
});
const createTodo = joi_1.default.object({
    title: joi_1.default.string().required(),
    color: joi_1.default.string(),
    description: joi_1.default.string().allow(''),
    allDay: joi_1.default.bool(),
    start: joi_1.default.date(),
    end: joi_1.default.date()
});
const updateTodo = joi_1.default.object({
    title: joi_1.default.string().required(),
    color: joi_1.default.string(),
    description: joi_1.default.string().allow(''),
    allDay: joi_1.default.bool(),
    start: joi_1.default.date(),
    end: joi_1.default.date()
});
const taskId = joi_1.default.object().keys({
    taskId: joi_1.default.string().required()
});
const fileId = joi_1.default.object().keys({
    fileId: joi_1.default.string().required()
});
const todoId = joi_1.default.object().keys({
    todoId: joi_1.default.string().required()
});
const path = joi_1.default.object().keys({
    path: joi_1.default.string().optional()
});
const createSubcontractor = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    contact: joi_1.default.string().required(),
    about: joi_1.default.string().allow(''),
    services: joi_1.default.array().items(joi_1.default.string()).required(),
    avatarUrl: joi_1.default.string()
});
const updateSubcontractor = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    contact: joi_1.default.string().required(),
    about: joi_1.default.string().allow(''),
    services: joi_1.default.array().items(joi_1.default.string()).required(),
    avatarUrl: joi_1.default.string()
});
const subconstractorId = joi_1.default.object().keys({
    subconstractorId: joi_1.default.string().required()
});
const createInsurance = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    contact: joi_1.default.string().required(),
    about: joi_1.default.string().allow(''),
    services: joi_1.default.array().items(joi_1.default.string()).required(),
    avatarUrl: joi_1.default.string()
});
const updateInsurance = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    contact: joi_1.default.string().required(),
    about: joi_1.default.string().allow(''),
    services: joi_1.default.array().items(joi_1.default.string()).required(),
    avatarUrl: joi_1.default.string()
});
const insuranceId = joi_1.default.object().keys({
    insuranceId: joi_1.default.string().required()
});
const createRealEstate = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    contact: joi_1.default.string().required(),
    about: joi_1.default.string().allow(''),
    services: joi_1.default.array().items(joi_1.default.string()).required(),
    avatarUrl: joi_1.default.string()
});
const updateRealEstate = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    zipCode: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    contact: joi_1.default.string().required(),
    about: joi_1.default.string().allow(''),
    services: joi_1.default.array().items(joi_1.default.string()).required(),
    avatarUrl: joi_1.default.string()
});
const realEstateId = joi_1.default.object().keys({
    realEstateId: joi_1.default.string().required()
});
const marketId = joi_1.default.object().keys({
    marketId: joi_1.default.string().required()
});
const notificationId = joi_1.default.object().keys({
    notificationId: joi_1.default.string().required()
});
const createFolder = joi_1.default.object({
    name: joi_1.default.string().required(),
    path: joi_1.default.string().allow('').required()
});
const renameFile = joi_1.default.object({
    name: joi_1.default.string().required(),
    id: joi_1.default.string().required()
});
const updateTags = joi_1.default.object({
    id: joi_1.default.string().required(),
    tags: joi_1.default.array().items(joi_1.default.string()).required()
});
const createEmailMarketing = joi_1.default.object({
    title: joi_1.default.string().required(),
    status: joi_1.default.string().allow('').required(),
    templateId: joi_1.default.number().required(),
    fromName: joi_1.default.string().required(),
    fromAddress: joi_1.default.string().email().required(),
    subjectLine: joi_1.default.string().required(),
    language: joi_1.default.string().required(),
    subscriptionType: joi_1.default.string().required(),
    text: joi_1.default.string().required(),
    schedule: joi_1.default.date().required(),
    sendTo: joi_1.default.array().items(joi_1.default.string().email()).required()
});
const createNotification = joi_1.default.object({
    title: joi_1.default.string().required(),
    content: joi_1.default.string().allow('').required(),
    type: joi_1.default.string().allow('').required()
});
const updateNotification = joi_1.default.object({
    title: joi_1.default.string(),
    content: joi_1.default.string().allow(''),
    type: joi_1.default.string().allow(''),
    status: joi_1.default.number()
});
const uuid = joi_1.default.object().keys({
    uuid: joi_1.default.string().required()
});
const VSchema = {
    Register,
    Login,
    createUser,
    userId,
    deleteUser,
    updateUser,
    createRole,
    roleId,
    updateRole,
    createCustomer,
    customerId,
    updateCustomer,
    createInvoice,
    invoiceId,
    updateInvoice,
    remove,
    removeTask,
    createEstimate,
    estimateId,
    updateEstimate,
    createTask,
    updateTask,
    taskId,
    fileId,
    path,
    createTodo,
    updateTodo,
    todoId,
    createSubcontractor,
    updateSubcontractor,
    subconstractorId,
    createInsurance,
    updateInsurance,
    insuranceId,
    createRealEstate,
    updateRealEstate,
    realEstateId,
    createFolder,
    renameFile,
    updateTags,
    createEmailMarketing,
    marketId,
    createNotification,
    updateNotification,
    notificationId,
    uuid
};
exports.default = VSchema;
//# sourceMappingURL=validation.js.map