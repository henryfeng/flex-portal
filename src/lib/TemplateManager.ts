import appCtx from "./AppContext";
import type Template from "./Template";
import type {ComponentFrame} from "./Template";

const templateServiceUrl = '/flex-dashboard/service/template'

const parseClassParameters = (parameterText:string):any => {
    if (parameterText != null && parameterText.length >0) {
        return JSON.parse(parameterText);
    }
    return null;
}

const templateService = {
    getList: (mod: string) => {
        return appCtx.getFetcher().get(templateServiceUrl, {mod});
    },

    load: (id: string) => {
        return appCtx.getFetcher().get(`${templateServiceUrl}/${id}`, null, template => {
            let frames:Array<ComponentFrame> = [];
            template.components.forEach(component => {
                const frame: ComponentFrame = {
                    frameId: component.frameId,
                    width: component.width,
                    height: component.height,
                    posX: component.posX,
                    posY: component.posY,
                    script: component.frameScript,
                    params: component.params,
                    component: {
                        serviceUrl: component.serviceUrl,
                        script: component.componentScript,
                        clazz: {
                            code: component.classCode,
                            parameters: parseClassParameters(component.parameters)
                        }
                    }
                }
                frames.push(frame);
            })
            delete template.components;
            template.frames = frames;
            return template;
        });
    }
}


export default class TemplateManager {

    #list: Array<Template> = null;
    #current: Template = null;
    #mod: string;

    private static instance:TemplateManager = null;


    static getInstance(): TemplateManager {
        if (TemplateManager.instance == null) {
            throw new Error('TemplateManager hasn\'t been initialized');
        }
        return TemplateManager.instance;
    }

    static initialize(modName: string): TemplateManager {
        if (TemplateManager.instance == null) {
            TemplateManager.instance = new TemplateManager(modName);
        } else {
            console.warn('TemplateManager has been initialized');
        }
        return TemplateManager.instance;
    }

    /**
     *
     * @param modName
     */
    private constructor(modName: string) {
        this.#mod = modName;
    }

    /**
     *
     */
    async load():Promise<void> {
        this.#list = await templateService.getList(this.#mod);
        let template: any = this.findDefaultTemplate();
        await this.loadTemplate(template);
    }

    /**
     * 查询默认的模版
     * @private
     */
    private findDefaultTemplate(): any {
        let found = null;
        let i=0;
        while (found==null && i<this.#list.length) {
            let item = this.#list[i];
            if (item.isDefault) {
                found = item;
            } else {
                i++
            }
        }
        return found == null ? this.#list.length > 0 ? this.#list[0] : null : found;
    }

    async loadTemplate(template: any) {
        if (template != null) {
            if (template.frames == null) {
                console.debug('加载模版，', template.id);
                let t = await templateService.load(template.id);
                template.frames = t.frames;
                console.log('加载后的模版布局', template);
            }
            this.#current = template;
        }
    }

    get current():Template {
        return this.#current;
    }
}

