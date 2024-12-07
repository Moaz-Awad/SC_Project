package scanner

import "fmt"

const (
	vulnerabilityAnalysisPrompt = `Please analyze the following code for vulnerabilities and provide the results in the following format:
1. **Vulnerabilities**: List of identified vulnerabilities.
2. **Proof of Concept**: Example of how the vulnerability can be exploited.
3. **Recommended Fixes**: Suggestions to fix the vulnerabilities.
4. **Code Quality**: General comments on code quality and best practices.

Code:
%s`
)

func formatPrompt(code string) string {
	return fmt.Sprintf(vulnerabilityAnalysisPrompt, code)
}
