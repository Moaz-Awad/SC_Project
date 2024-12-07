package scanner

type ScanOptions struct {
	Model string
}

type ScanInput struct {
	FileName string
	Content  []byte
}

type ScanOutput struct {
	Content string
	Error   error
}