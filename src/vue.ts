export class VueComponentObject {
    /** This is mostly used for root ui component */
    el: string;
    template: string;
    created: Function;
    props: string[] = [];
    computed: {};
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
        if (propKey.startsWith('comp'))
            component.computed = instance[propKey];
    }
    component.data = () => Object.assign({}, data);
    const proto = Object.getPrototypeOf(instance);
    for (const funcKey of Object.getOwnPropertyNames(proto)) {
        if (funcKey == 'created')
            component.created = proto[funcKey];
        else
            component.methods[funcKey] = proto[funcKey];
    }
    if (instance.template)
        component.template = instance.template;
    if (instance.mixins)
        component.mixins = instance.mixins;
    if (instance.el)
        component.el = instance.el;
    return component;
}