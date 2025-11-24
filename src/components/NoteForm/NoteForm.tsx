// src/components/NoteForm/NoteForm.tsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote, type CreateNotePayload } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSuccess: () => void; 
  onCancel: () => void; // Close modal without saving
}

const initialValues: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters") // ✅ Виправив текст помилки
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content must be at most 500 characters"), // ✅ Опційне поле, без .required()
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<Note, Error, CreateNotePayload>({
  mutationFn: (payload) => createNote(payload),
  // ✅ Remove onSuccess from here
});

  const handleSubmit = async (
  values: CreateNotePayload,
  actions: FormikHelpers<CreateNotePayload>
) => {
  console.log("🚀 Form submitted with values:", values);
  
  try {
    console.log("📤 Sending mutation...");
    const result = await mutateAsync(values);
    console.log("✅ Mutation successful:", result);
    
    actions.resetForm();
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    onSuccess();
  } catch (e) {
    console.error("❌ Error creating note:", e);
  } finally {
    actions.setSubmitting(false);
  }
};

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel} // ✅ Changed from onSuccess
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || isPending}
              // ✅ Removed onClick={onSuccess}
            >
              {isSubmitting || isPending ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}