import { TProject } from "@/app/types/projectType";
import React from "react";

interface ProjectTableProps {
  data: TProject[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((project) => (
              <tr key={project._id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{project.title}</td>
                <td className="px-6 py-4">{project.category}</td>
                <td className="px-6 py-4">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 flex space-x-3">
                  <button
                    onClick={() => onEdit(project._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(project._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
