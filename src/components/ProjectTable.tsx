import { TProject } from "@/types/projectType";
import React from "react";

interface ProjectTableProps {
  data: TProject[];
  onEdit: (id: string) => void;
  onDeleteRequest: (project: TProject) => void;
  onView: (id: string) => void;
  onStatusChange: (project: TProject, isActive: boolean) => void;
  onOrderChange: (project: TProject, order: number) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  data,
  onEdit,
  onDeleteRequest,
  onView,
  onStatusChange,
  onOrderChange,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">No.</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium">Order</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((project, index) => (
              <tr key={project._id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 font-semibold text-slate-500">{index + 1}</td>
                <td className="px-6 py-4">{project.title}</td>
                <td className="px-6 py-4">{project.category}</td>
                <td className="px-6 py-4">
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min={0}
                    value={project.displayOrder ?? 0}
                    onChange={(event) => onOrderChange(project, Number(event.target.value))}
                    className="w-20 rounded border px-2 py-1"
                    aria-label={`Display order for ${project.title}`}
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={project.isActive !== false ? "active" : "inactive"}
                    onChange={(event) => onStatusChange(project, event.target.value === "active")}
                    className={`rounded-lg border px-2 py-1 text-xs font-semibold ${
                      project.isActive !== false
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 bg-slate-100 text-slate-600"
                    }`}
                    aria-label={`Status for ${project.title}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-6 py-4 flex space-x-3">
                  <button onClick={() => onView(project._id)} className="rounded-md bg-indigo-500 px-4 py-2 text-white shadow-md hover:bg-indigo-700">
                    View
                  </button>
                  <button
                    onClick={() => onEdit(project._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteRequest(project)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4">
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
