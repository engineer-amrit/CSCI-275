export const getDeps = (deps: Record<string, string>, include = "workspace", exclude: string[] = []) => {
    const depList = [];
    for (const dep in deps) {
        if (!Object.hasOwn(deps, dep)) continue;

        const element = deps[dep as keyof typeof deps];
        if (element && element.startsWith(include) && !exclude.includes(dep)) {
            depList.push(dep);
        }
    }

    return depList;
}