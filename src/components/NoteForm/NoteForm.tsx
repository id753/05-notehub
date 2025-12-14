import { useId } from "react";
import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, type CreateNoteData } from "../../services/noteService";
import * as Yup from "yup";

interface NoteFormProps {
  onClose: () => void;
  onPageChange: (page: number) => void;
}

const initialValues: CreateNoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

const NoteForm = ({ onClose, onPageChange }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
      onPageChange(1);
    },
  });

  const handleSubmit = (
    values: CreateNoteData,
    actions: FormikHelpers<CreateNoteData>
  ) => {
    mutate(values);
    actions.resetForm();
  };
  const fieldId = useId();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title too short")
      .max(50, "Title too long")
      .required("Title is required"),
    content: Yup.string().max(500, "Content too long"),
    tag: Yup.string()
      .oneOf(["Shopping", "Meeting", "Personal", "Work", "Todo"], "Invalid tag")
      .required("Tag is required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            name="title"
            type="text"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button onClick={onClose} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={css.submitButton}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
