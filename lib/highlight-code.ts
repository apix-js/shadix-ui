import { codeToHtml } from 'shiki'

export async function highlightCode(code: string, language: string = 'tsx') {
    try {
        const html = await codeToHtml(code, {
            lang: language,
            themes: {
                dark: 'github-dark',
                light: 'github-light',
            },
            transformers: [
                {
                    pre(node) {
                        node.properties['class'] =
                            'no-scrollbar pl-0 min-w-0 overflow-x-auto px-4 py-3.5 outline-none has-[[data-highlighted-line]]:px-0 has-[[data-line-numbers]]:px-0 has-[[data-slot=tabs]]:p-0 !bg-transparent'
                        node.properties['data-line-numbers'] = ''
                    },
                    code(node) {
                        node.properties['class'] =
                            'relative grid min-w-full break-words rounded-md border-0 bg-transparent p-0 text-sm shadow-none'
                    },
                    line(node) {
                        node.properties['class'] = 'min-h-[1.5rem] w-full break-words px-4 py-0.5 leading-relaxed'
                        node.properties['data-line'] = ''
                    },
                },
            ],
        })

        return html
    } catch (error) {
        console.error('Failed to highlight code:', error)
        return `<pre class="overflow-x-auto max-h-[450px] rounded-lg border bg-card p-4 text-sm" data-line-numbers=""><code class="relative grid min-w-full break-words rounded-md border-0 bg-transparent p-0 text-sm shadow-none">${code}</code></pre>`
    }
}
