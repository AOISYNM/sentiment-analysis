import { z } from "zod";

export const MAX_LENGTH = 2000;

export const textSchema = z
  .string()
  .trim()
  .min(1, "Enter a sentence to analyze.")
  .max(MAX_LENGTH, `Shorten the text to ${MAX_LENGTH} characters or fewer.`)
  .refine((v) => /[a-z0-9]/i.test(v), "Include at least one letter or number.");
