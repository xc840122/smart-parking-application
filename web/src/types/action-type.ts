// Type for form actions
export type Feedback = {
  result: boolean;
  message: string;
};

export type FormState = {
  feedback: Feedback;
};