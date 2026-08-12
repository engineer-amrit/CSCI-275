import type { ErrorsDTO } from 'common'
import type {
  UseFormSetError,
  Path,
  FieldValues,
  FieldErrors,
  UseFormClearErrors,
} from 'react-hook-form'

const isFile = (v: unknown): v is File | Blob =>
  v instanceof File || v instanceof Blob

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v) && !isFile(v)

export const formDataMaker = <T extends AnyObject>(data: T): FormData => {
  const formData = new FormData()

  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null) return

    // File / Blob
    if (isFile(value)) {
      formData.append(key, value)
      return
    }

    // Array
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        // media array = multiple files with same key
        if (isFile(item)) {
          formData.append(key, item)
        } else {
          append(`${key}[${index}]`, item)
        }
      })
      return
    }

    // Object (recursive)
    if (isObject(value)) {
      for (const k in value) {
        append(`${key}[${k}]`, value[k])
      }
      return
    }

    // Primitive
    formData.append(key, String(value))
  }

  for (const key in data) {
    append(key, data[key])
  }

  return formData
}

export type AnyObject = Record<string, unknown>

export function flattenToQuery(
  obj: AnyObject,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    const value = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key

    if (
      value === undefined ||
      value === null ||
      value === '' ||
      Number.isNaN(value)
    )
      continue

    if (value instanceof Date) {
      result[newKey] = value.toISOString() // utc string
    } else if (Array.isArray(value)) {
      result[newKey] = value.join(',') // comma separated for arrays
    } else if (isObject(value)) {
      const nested = flattenToQuery(value, newKey)
      if (Object.keys(nested).length > 0) {
        Object.assign(result, nested)
      }
      // else skip empty object
    } else {
      result[newKey] = String(value)
    }
  }

  return result
}

export const queryToObj = (q: Record<string, string>) => {
  const nestedQuery: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(q)) {
    const path = key.split('.')
    let current = nestedQuery
    for (let i = 0; i < path.length; i++) {
      const part = path[i]
      if (!part) continue
      if (i === path.length - 1) {
        let parsedValue
        if (value.includes(',')) {
          parsedValue = value.split(',') // convert comma separated back to array
        } else {
          parsedValue = value
        }
        current[part] = parsedValue
      } else {
        current[part] = current[part] || {}
        current = current[part] as Record<string, unknown>
      }
    }
  }
  return nestedQuery
}

export const mapFormErrors = <T extends FieldValues>(
  error: ErrorsDTO[],
  setError: UseFormSetError<T>,
) => {
  const duplicateRecord: string[] = []
  error.forEach((e) => {
    const path: Path<T> = e.path.join('.') as Path<T>
    if (duplicateRecord.includes(path)) return
    duplicateRecord.push(path)
    setError(path, {
      type: 'manual',
      message: e.message,
    })
  })
}
export const cleanErrors = <T extends FieldValues>(
  errors: FieldErrors,
  clearErrors: UseFormClearErrors<T>,
) => {
  const keys = Object.keys(errors)
  const isError = keys.length > 0
  if (isError) clearErrors()
}

// import axiosInstance from "./axiosInstance";

// export const getFileFields = async (url: string[] | string) => {
//     const fetchImageAsFile = async (url: string): Promise<File> => {
//         const response = await axiosInstance.get(`/cdn/?url=${url}`, {
//             responseType: "blob",
//         }); // Set responseType to 'blob'
//         const blob = response.data;
//         const fileName = url.split("/").pop() || "default_filename"; // Extract file name from URL
//         return new File([blob], fileName, { type: blob.type });
//     };

//     const createFileList = (files: File[]): FileList => {
//         const dataTransfer = new DataTransfer();
//         files.forEach((file) => dataTransfer.items.add(file));
//         return dataTransfer.files;
//     };

//     if (typeof url === "string") {
//         return Array.from(createFileList([await fetchImageAsFile(url)]));
//     } else {
//         return Array.from(
//             createFileList(
//                 await Promise.all(url.map(async (url) => await fetchImageAsFile(url))),
//             ),
//         );
//     }
// };
