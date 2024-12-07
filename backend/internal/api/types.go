package api

type ScanRequest struct {
	Files []File `json:"files"`
}

type File struct {
	Name    string `json:"name"`
	Content []byte `json:"content"`
}

type ScanResponse struct {
	Results []ScanResult `json:"results"`
}

type ScanResult struct {
	FileName string `json:"fileName"`
	Content  string `json:"content"`
	Error    string `json:"error,omitempty"`
}