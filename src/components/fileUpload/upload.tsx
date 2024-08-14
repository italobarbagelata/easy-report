import { Button } from "@/components/ui/button"

export default function UploadFile() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Upload Images</h2>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-gray-400 dark:hover:border-gray-500">
          <CloudUploadIcon className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            Drag and drop your images here or
            <button className="text-blue-500 hover:underline">click to select files</button>
          </p>
          <input accept="image/*" className="hidden" multiple type="file" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="relative group">
            <img
              alt="Image"
              className="rounded-md object-cover w-full aspect-square"
              height={100}
              src="/placeholder.svg"
              width={100}
            />
            <button className="absolute top-2 right-2 bg-gray-800 dark:bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="relative group">
            <img
              alt="Image"
              className="rounded-md object-cover w-full aspect-square"
              height={100}
              src="/placeholder.svg"
              width={100}
            />
            <button className="absolute top-2 right-2 bg-gray-800 dark:bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="relative group">
            <img
              alt="Image"
              className="rounded-md object-cover w-full aspect-square"
              height={100}
              src="/placeholder.svg"
              width={100}
            />
            <button className="absolute top-2 right-2 bg-gray-800 dark:bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Upload</Button>
        </div>
      </div>
    </div>
  )
}

function CloudUploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}