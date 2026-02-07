import { z } from 'zod';

export const jobFormSchema = z.object({
    targetUrl: z.string().url({ message: "Please enter a valid URL." }),
    username: z.string().min(1, { message: "Username is required." }),
    password: z.string().min(1, { message: "Password is required." }),
    themeId: z.string().uuid({ message: "Please select a theme." }),
    // Audio file validation will be handled on the client side with File API, 
    // but we can validate the result (uploaded URL) or the presence of a file object loosely here if needed.
    // For the form state, we might just track the file separately or use a refine.
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
