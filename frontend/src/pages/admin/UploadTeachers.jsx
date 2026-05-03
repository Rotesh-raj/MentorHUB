import { useState, useRef, useCallback } from 'react';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import {
  UploadCloud, FileText, X, AlertCircle,
  CheckCircle, Download, BookOpen, Trash2, AlertTriangle
} from 'lucide-react';
import CSVUploadHistory from './CSVUploadHistory';

/* ── Client-side column check (mirrors backend) ── */
const REQUIRED_COLS = ["staff id", "teacher name", "email id", "department"];

const validateTeacherHeaders = (headerLine) => {
  const cols = headerLine.split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  return REQUIRED_COLS.filter(r => !cols.includes(r));
};

/* ── CSV template ── */
const downloadTemplate = () => {
  const content = `Staff ID,Teacher Name,Email ID,Department\nT001,Jane Smith,jane@college.edu,Mathematics\n`;
  const blob = new Blob([content], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'teachers_template.csv'; a.click();
  URL.revokeObjectURL(url);
};

const UploadTeachers = () => {
  const [file, setFile]           = useState(null);
  const [csvData, setCsvData]     = useState({ headers: [], rows: [] });
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [clientError, setClientError] = useState('');
  const inputRef = useRef(null);
  const { success, error } = useNotification();

  const previewCSV = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return;
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows    = lines.slice(1, 6).map(line =>
      line.split(',').map(v => v.trim().replace(/"/g, ''))
    );
    setCsvData({ headers, rows });
  };

  const validateAndSet = useCallback((selectedFile) => {
    setClientError('');
    setCsvData({ headers: [], rows: [] });
    setFile(null);

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setClientError('❌ Invalid file type. Please upload a .csv file only.');
      return;
    }

    if (selectedFile.size === 0) {
      setClientError('❌ The selected file is empty.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text    = e.target.result;
      const firstLine = text.split('\n')[0] || '';
      const missing   = validateTeacherHeaders(firstLine);

      if (missing.length > 0) {
        setClientError(
          `❌ Invalid Teacher CSV format. Missing columns: ${missing.map(c => c.replace(/\b\w/g, l => l.toUpperCase())).join(', ')}.\n` +
          `Required: Staff ID, Teacher Name, Email ID, Department`
        );
        return;
      }

      setFile(selectedFile);
      previewCSV(text);
    };
    reader.readAsText(selectedFile);
  }, []);

  const handleFileChange  = (e) => validateAndSet(e.target.files[0]);
  const handleDrop        = (e) => {
    e.preventDefault(); setDragOver(false);
    validateAndSet(e.dataTransfer.files[0]);
  };
  const handleDragOver    = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave   = () => setDragOver(false);

  const clearFile = () => {
    setFile(null); setCsvData({ headers: [], rows: [] });
    setClientError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { error('Please select a CSV file.'); return; }
    if (clientError) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/admin/upload/teachers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      success(res.data.message || `✅ ${res.data.count || 0} teachers uploaded!`);
      clearFile();
    } catch (err) {
      error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  /* ── Delete Existing Data ── */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await api.delete('/admin/delete/teachers');
      success(res.data.message || 'Department teacher data cleared successfully.');
      setShowConfirm(false);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete data. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Upload Teachers</h1>
            <p className="text-sm text-gray-500">Bulk import approved teachers via CSV</p>
          </div>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 text-sm text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors font-medium"
        >
          <Download size={15} /> Download Template
        </button>
      </div>

      {/* Format guide */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FileText size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Required CSV Columns</p>
            <div className="flex flex-wrap gap-2">
              {['Staff ID', 'Teacher Name', 'Email ID', 'Department'].map(col => (
                <code key={col} className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-md font-mono">
                  {col}
                </code>
              ))}
            </div>
            <p className="text-xs text-amber-600 mt-2">Column names are case-insensitive. Email must be valid format.</p>
          </div>
        </div>
      </div>

      {/* Client error */}
      {clientError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 whitespace-pre-line">{clientError}</p>
        </div>
      )}

      {/* Drop zone */}
      <form onSubmit={handleUpload}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !file && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer
            ${dragOver    ? 'border-emerald-400 bg-emerald-50' : ''}
            ${file        ? 'border-green-300 bg-green-50 cursor-default' : ''}
            ${!file && !dragOver ? 'border-gray-200 bg-gray-50 hover:border-emerald-300 hover:bg-emerald-50/50' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB · {csvData.rows.length} rows previewed</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="ml-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <UploadCloud size={26} className={dragOver ? 'text-emerald-500' : 'text-gray-400'} />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {dragOver ? 'Drop your CSV here' : 'Drag & drop your CSV file here'}
              </p>
              <p className="text-xs text-gray-400">or click to browse · .csv files only</p>
            </>
          )}
        </div>

        {/* Preview */}
        {csvData.rows.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Preview (first {csvData.rows.length} rows)
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {csvData.headers.map((h, i) => (
                      <th key={i} className="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {csvData.rows.map((row, ri) => (
                    <tr key={ri} className="hover:bg-gray-50">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2.5 text-gray-700 max-w-[150px] truncate">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || uploading || !!clientError}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-sm disabled:cursor-not-allowed disabled:shadow-none"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading Teachers...
            </>
          ) : (
            <>
              <UploadCloud size={18} />
              Upload Teachers{file ? ` — ${file.name.slice(0, 20)}` : ''}
            </>
          )}
        </button>
      </form>

      {/* ── DELETE SECTION ── */}
      <div className="mt-12 bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <AlertTriangle size={24} />
            <h2 className="text-lg font-bold">Delete Existing Teacher Data</h2>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-700 leading-relaxed">
              ⚠️ <strong>Warning:</strong> Deleting existing data will permanently remove previous uploaded records for your department. This action cannot be undone. Registered teacher accounts will remain safe.
            </p>
          </div>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-white border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all duration-200"
            >
              <Trash2 size={18} />
              Delete Existing Teacher Data
            </button>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm font-semibold text-gray-700 text-center">Are you sure? This action is permanent.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={deleting}
                  className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 px-6 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>Confirm Delete</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSV Upload History Component */}
      <CSVUploadHistory />

    </div>
  );
};

export default UploadTeachers;
