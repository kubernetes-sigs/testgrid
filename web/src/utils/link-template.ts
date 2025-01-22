// TODO(michelle192837): Implement link template parsing.
export interface TestGridLinkTemplate {
    url: URL;
}

export function substitute(template: TestGridLinkTemplate): URL {
    return template.url;
}
