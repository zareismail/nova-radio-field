import _ from 'lodash';

export default {
    mounted() {
        this.toggleEnabled = this.field.toggle && _.toArray(this.field.toggle).length;

        if (this.toggleEnabled) {
            this.mapFields();
            this.calculateFieldVisibility();
            this.calculatePanelVisibility();
        }
    },
    computed: {

    },
    data() {
        return {
            toggleEnabled: false,
            toggleFields: {},
        }
    },
    methods: {
        findFieldsWhichCanBeToggled() {
            const fieldsToToggle = _.uniq(
                _.flatten(
                    _.toArray(this.field.toggle)
                )
            ); 

            this.deepComponents().filter(c => c.field).forEach(component => {
                if (fieldsToToggle.indexOf(component.field.attribute) !== -1) {
                    this.toggleFields[component.field.attribute] = component;
                }
            });
        },
        deepComponents(component = null){  
            if(component === null) {
                component = this.$parent.$parent.$parent
            }

            let components = _.flatMap(
                component.$children, component => this.deepComponents(component)
            ) 

            return _.tap(components, components => components.push(component))
        },
        generateFieldMap() {

        },
        mapFields() {
            this.findFieldsWhichCanBeToggled();
            this.generateFieldMap();
        },
        resetVisibility() {
            return _.each(this.toggleFields, field => {
                field.$el.classList.remove('mlbz-hidden');
            });
        },
        calculateFieldVisibility() {
            this.resetVisibility();

            const fields = this.field.toggle[this.rawValue];

            (fields || []).forEach(field => {
                if (this.toggleFields[field]) {
                    this.toggleFields[field].$el.classList.add('mlbz-hidden')
                }
            })  
        },
        calculatePanelVisibility() {   
            this.deepComponents().filter(c => c.panel).map(panel => {
                let fields = this.deepComponents(panel).filter(component => { 
                    return component.field && ! component.$el.classList.contains('mlbz-hidden')
                })
 
                fields.length > 0 ? panel.$el.classList.remove('mlbz-hidden') : panel.$el.classList.add('mlbz-hidden')
            })  
        }
    },
    watch: {
        value() {
            if(this.toggleEnabled) {
                this.calculateFieldVisibility() 
                this.calculatePanelVisibility()
            } 
        }
    }
}
