"use client";

import React from "react";

import type { NewTaskCard, ObjectIdString, TaskCard } from "@acme/validators";

// import type { taskCardSchema } from "./task-card-schema";
import { api } from "~/trpc/react"; // Ensure you import your API hook
import TaskCardDialog from "./task-card-dialog";

interface NewTaskCardProps {
  projectId: ObjectIdString;
  statusId: ObjectIdString;
  onTaskCreated: (newTask: TaskCard) => void;
}

const NewTaskCard = ({
  projectId,
  statusId,
  onTaskCreated,
}: NewTaskCardProps) => {
  const utils = api.useUtils();

  const addTaskMutation = api.task.addTask.useMutation({
    onSuccess: (newTask) => {
      // Handle success
      console.log("Task created successfully");
      void utils.task.getTaskByStatusId.invalidate(); // Invalidate tasks and refresh data
      onTaskCreated(newTask); // Pass the new task back to the parent
      // void utils.task.getStatusesByProjectId.invalidate();
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  }); // Initialize your mutation

  // const handleSubmit = async (taskData: z.infer<typeof TaskCardSchema>) => {
  const handleSubmit = async (taskData: NewTaskCard) => {
    try {
      console.log("running handle submit function");
      // Send the task data (validated in TaskCardDialog) to the tRPC mutation
      await addTaskMutation.mutateAsync(taskData);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div>
      {/* Render the TaskCardDialog to create a new task */}
      <TaskCardDialog
        onSubmit={handleSubmit}
        dialogButtonText="+ New task"
        submitButtonText="Create task"
        projectId={projectId}
        statusId={statusId}
      />
    </div>
  );
};

export default NewTaskCard;
