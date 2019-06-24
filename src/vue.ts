export class VueComponentObject {
    template: string;
    created: Function;
    props: string[] = [];
    data = () => {};
    methods = {};
    mixins: any;
}

export function createVueComponent(instance: any) {
    const component = new VueComponentObject();
    const data = {};
    for (let propKey in instance) {
        if (propKey.startsWith('prop')) {
            component.props.push(propKey);
        }
        if (propKey.startsWith('data'))
            data[propKey] = instance[propKey];
    }
    component.data = () => Object.assign({}, data);
    const proto = Object.getPrototypeOf(instance);
    for (const funcKey of Object.getOwnPropertyNames(proto)) {
        if (funcKey == 'created')
            component.created = proto[funcKey];
        else
            component.methods[funcKey] = proto[funcKey];
    }
    component.template = instance.template;
    if (instance.mixins)
        component.mixins = instance.mixins;
    return component;
}