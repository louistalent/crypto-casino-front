import Joi from 'joi';

const Register = Joi.object({
    firstname: Joi.string().max(36).required(),
    lastname: Joi.string().max(36).required(),
    country: Joi.string().max(36).required(),
    username: Joi.string().max(36).required(),
    currency: Joi.string().max(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

const Login = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    ipAddress: Joi.string().optional()
});

const createUser = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().max(36).required(),
    country: Joi.string().max(36).required(),
    firstName: Joi.string().max(36).required(),
    lastName: Joi.string().max(36).required(),
    currency: Joi.string().max(36).required(),
    password: Joi.string().min(6).required(),
    roleId: Joi.string().required(),
    status: Joi.string().required(),
    avatarUrl: Joi.string()
});

const userId = Joi.object().keys({
    userId: Joi.string().required()
});

const deleteUser = Joi.object().keys({
    userId: Joi.number().required()
});

const updateUser = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().max(36).required(),
    country: Joi.string().max(36).required(),
    firstName: Joi.string().max(36).required(),
    lastName: Joi.string().max(36).required(),
    currency: Joi.string().max(36).required(),
    password: Joi.string().min(6).required(),
    roleId: Joi.string().required(),
    status: Joi.string().required(),
    address: Joi.string().required(),
    state: Joi.string().required(),
    birthdate: Joi.string().required(),
    city: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    avatarUrl: Joi.string()
});

const createRole = Joi.object({
    name: Joi.string().max(36).required(),
    slug: Joi.string().max(36).required()
});

const roleId = Joi.object().keys({
    roleId: Joi.string().required()
});

const updateRole = Joi.object({
    name: Joi.string().max(36).required(),
    slug: Joi.string().max(36).required()
});

const customerId = Joi.object().keys({
    customerId: Joi.string().required()
});

const createCustomer = Joi.object({
    primaryEmail: Joi.string().required(),
    secondaryEmail: Joi.string().allow(''),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthday: Joi.date().required(),
    primaryAddress: Joi.string().required(),
    secondaryAddress: Joi.string().allow(''),
    primaryContact: Joi.string().required(),
    secondaryContact: Joi.string().allow(''),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    foundUs: Joi.string().allow(''),
    about: Joi.string().allow(''),
    serviceNeeded: Joi.array().items(Joi.string()),
    avatarUrl: Joi.string().allow('')
});

const updateCustomer = Joi.object({
    primaryEmail: Joi.string().required(),
    secondaryEmail: Joi.string().allow(''),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthday: Joi.date().required(),
    primaryAddress: Joi.string().required(),
    secondaryAddress: Joi.string().allow(''),
    primaryContact: Joi.string().required(),
    secondaryContact: Joi.string().allow(''),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    foundUs: Joi.string().allow(''),
    about: Joi.string().allow(''),
    serviceNeeded: Joi.array().items(Joi.string()),
    avatarUrl: Joi.string().allow('')
});

const createInvoice = Joi.object({
    dueDate: Joi.date().required(),
    taxes: Joi.number().required(),
    status: Joi.string().max(8).required(),
    createDate: Joi.date().required(),
    discount: Joi.number().required(),
    totalAmount: Joi.number().required(),
    invoiceNumber: Joi.string().required(),
    items: Joi.array()
        .items(
            Joi.object({
                title: Joi.string().required(),
                price: Joi.number().min(0).required(),
                total: Joi.number().min(0),
                service: Joi.string().allow(''),
                quantity: Joi.number().min(0).required(),
                description: Joi.string().allow('')
            })
        )
        .required(),
    invoiceFrom: Joi.object(),
    invoiceTo: Joi.object(),
    isDraft: Joi.boolean().required()
});

const updateInvoice = Joi.object({
    dueDate: Joi.date().required(),
    taxes: Joi.number().required(),
    status: Joi.string().max(8).required(),
    createDate: Joi.date().required(),
    discount: Joi.number().required(),
    totalAmount: Joi.number().required(),
    invoiceNumber: Joi.string().required(),
    items: Joi.array()
        .items(
            Joi.object({
                title: Joi.string().required(),
                price: Joi.number().min(0).required(),
                total: Joi.number().min(0),
                service: Joi.string().allow(''),
                quantity: Joi.number().min(0).required(),
                description: Joi.string().allow('')
            })
        )
        .required(),
    invoiceFrom: Joi.object(),
    invoiceTo: Joi.object(),
    isDraft: Joi.boolean().required()
});

const invoiceId = Joi.object().keys({
    invoiceId: Joi.string().required()
});

const remove = Joi.object().keys({
    ids: Joi.array().items(Joi.string()).required()
});

const removeTask = Joi.object().keys({
    ids: Joi.array().items(Joi.string()).required()
});

const createEstimate = Joi.object({
    dueDate: Joi.date().required(),
    taxes: Joi.number().required(),
    status: Joi.string().max(8).required(),
    createDate: Joi.date().required(),
    discount: Joi.number().required(),
    totalAmount: Joi.number().required(),
    estimateNumber: Joi.string().required(),
    isTemplate: Joi.boolean(),
    items: Joi.array()
        .items(
            Joi.object({
                id: Joi.string().optional(),
                title: Joi.string().required(),
                price: Joi.number().min(0).required(),
                total: Joi.number().min(0),
                service: Joi.string().allow(''),
                quantity: Joi.number().min(0).required(),
                description: Joi.string().allow('')
            })
        )
        .required(),
    estimateFrom: Joi.object(),
    estimateTo: Joi.object(),
    isDraft: Joi.boolean().required()
});

const updateEstimate = Joi.object({
    dueDate: Joi.date().required(),
    taxes: Joi.number().required(),
    status: Joi.string().max(8).required(),
    createDate: Joi.date().required(),
    discount: Joi.number().required(),
    totalAmount: Joi.number().required(),
    estimateNumber: Joi.string().required(),
    isTemplate: Joi.boolean(),
    items: Joi.array()
        .items(
            Joi.object({
                title: Joi.string().required(),
                price: Joi.number().min(0).required(),
                total: Joi.number().min(0),
                service: Joi.string().allow(''),
                quantity: Joi.number().min(0).required(),
                description: Joi.string().allow('')
            })
        )
        .required(),
    estimateFrom: Joi.object(),
    estimateTo: Joi.object(),
    isDraft: Joi.boolean().required()
});

const estimateId = Joi.object().keys({
    estimateId: Joi.string().required()
});

const createTask = Joi.object({
    name: Joi.string().min(1).required(),
    status: Joi.string().required(),
    priority: Joi.string().required(),
    customer: Joi.object().required(),
    subcontractors: Joi.array().required(),
    description: Joi.string().min(1).required(),
    durations: Joi.object().required(),
    services: Joi.array().required()
});

const updateTask = Joi.object({
    name: Joi.string(),
    status: Joi.string(),
    priority: Joi.string(),
    customer: Joi.object(),
    subcontractors: Joi.array(),
    description: Joi.string().allow(''),
    durations: Joi.object().required(),
    services: Joi.array().required()
});

const createTodo = Joi.object({
    title: Joi.string().required(),
    color: Joi.string(),
    description: Joi.string().allow(''),
    allDay: Joi.bool(),
    start: Joi.date(),
    end: Joi.date()
});

const updateTodo = Joi.object({
    title: Joi.string().required(),
    color: Joi.string(),
    description: Joi.string().allow(''),
    allDay: Joi.bool(),
    start: Joi.date(),
    end: Joi.date()
});

const taskId = Joi.object().keys({
    taskId: Joi.string().required()
});

const fileId = Joi.object().keys({
    fileId: Joi.string().required()
});

const todoId = Joi.object().keys({
    todoId: Joi.string().required()
});

const path = Joi.object().keys({
    path: Joi.string().optional()
});

const createSubcontractor = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
    about: Joi.string().allow(''),
    services: Joi.array().items(Joi.string()).required(),
    avatarUrl: Joi.string()
});

const updateSubcontractor = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
    about: Joi.string().allow(''),
    services: Joi.array().items(Joi.string()).required(),
    avatarUrl: Joi.string()
});

const subconstractorId = Joi.object().keys({
    subconstractorId: Joi.string().required()
});

const createInsurance = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
    about: Joi.string().allow(''),
    services: Joi.array().items(Joi.string()).required(),
    avatarUrl: Joi.string()
});

const updateInsurance = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
    about: Joi.string().allow(''),
    services: Joi.array().items(Joi.string()).required(),
    avatarUrl: Joi.string()
});

const insuranceId = Joi.object().keys({
    insuranceId: Joi.string().required()
});

const createRealEstate = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
    about: Joi.string().allow(''),
    services: Joi.array().items(Joi.string()).required(),
    avatarUrl: Joi.string()
});

const updateRealEstate = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
    about: Joi.string().allow(''),
    services: Joi.array().items(Joi.string()).required(),
    avatarUrl: Joi.string()
});

const realEstateId = Joi.object().keys({
    realEstateId: Joi.string().required()
});

const marketId = Joi.object().keys({
    marketId: Joi.string().required()
});

const notificationId = Joi.object().keys({
    notificationId: Joi.string().required()
});

const createFolder = Joi.object({
    name: Joi.string().required(),
    path: Joi.string().allow('').required()
});

const renameFile = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required()
});

const updateTags = Joi.object({
    id: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required()
});

const createEmailMarketing = Joi.object({
    title: Joi.string().required(),
    status: Joi.string().allow('').required(),
    templateId: Joi.number().required(),
    fromName: Joi.string().required(),
    fromAddress: Joi.string().email().required(),
    subjectLine: Joi.string().required(),
    language: Joi.string().required(),
    subscriptionType: Joi.string().required(),
    text: Joi.string().required(),
    schedule: Joi.date().required(),
    sendTo: Joi.array().items(Joi.string().email()).required()
});

const createNotification = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().allow('').required(),
    type: Joi.string().allow('').required()
});

const updateNotification = Joi.object({
    title: Joi.string(),
    content: Joi.string().allow(''),
    type: Joi.string().allow(''),
    status: Joi.number()
});

const uuid = Joi.object().keys({
    uuid: Joi.string().required()
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

export default VSchema;
