"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoSchema = void 0;
const zod_1 = require("zod");
exports.TodoSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    text: zod_1.z.string(),
    completed: zod_1.z.boolean(),
    userId: zod_1.z.string(),
    createdAt: zod_1.z.date().optional(),
});
//# sourceMappingURL=index.js.map