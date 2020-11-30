import EntriesRelationList from '@/components/EntriesRelationList'
import {afterEach, beforeEach, describe, expect, jest, test} from '@jest/globals'
import {mount} from '@vue/test-utils'
import Vue from 'vue'

describe('EntriesRelationList.vue', () => {
    let wrapper
    let ruleData
    let entryData1
    let entryData2
    beforeEach(() => {
        entryData1 = {
            relation: 'OR',
            entries: [
                [
                    'uri',
                    '/login'
                ],
                [
                    'uri',
                    '/account'
                ]
            ]
        }
        entryData2 = {
            relation: 'AND',
            entries: [
                [
                    'headers',
                    'user-agent',
                    'curl'
                ],
                [
                    'headers',
                    'content-type',
                    'application/json'
                ]
            ]
        }
        ruleData = {
            relation: 'AND',
            sections: [
                entryData1,
                entryData2
            ]
        }
        const onUpdate = (rule) => {
            wrapper.setProps({rule: rule})
        }
        wrapper = mount(EntriesRelationList, {
            propsData: {
                rule: ruleData,
                editable: true
            },
            listeners: {
                update: onUpdate
            }
        })
    })
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should have a single table rendered for each entries list', () => {
        const tables = wrapper.findAll('.entries-table')
        expect(tables.length).toEqual(2)
    })

    test('should display correct data from prop to view', () => {
        const wantedEntryData = wrapper.vm.ld.cloneDeep(entryData1.entries)
        const component = wrapper.findComponent(EntriesRelationList)
        const categories = component.findAll('.entry-category')
        const values = component.findAll('.entry-value')
        expect(categories.at(0).text().toLowerCase()).toContain(wantedEntryData[0][0].toLowerCase())
        expect(values.at(0).text().toLowerCase()).toContain(wantedEntryData[0][1].toLowerCase())
        expect(categories.at(1).text().toLowerCase()).toContain(wantedEntryData[1][0].toLowerCase())
        expect(values.at(1).text().toLowerCase()).toContain(wantedEntryData[1][1].toLowerCase())
        expect(ruleData.sections[0].entries).toEqual(wantedEntryData)
    })

    test('should display correct data from prop to view if data changed', async () => {
        const wantedEntryData = ['ip', '1.2.3.4']
        const newRuleData = JSON.parse(JSON.stringify(ruleData))
        newRuleData.sections[0].entries = [wantedEntryData]
        wrapper.setProps({rule: newRuleData})
        await Vue.nextTick()
        const component = wrapper.findComponent(EntriesRelationList)
        const categories = component.findAll('.entry-category')
        const values = component.findAll('.entry-value')
        expect(categories.at(0).text().toLowerCase()).toContain(wantedEntryData[0].toLowerCase())
        expect(values.at(0).text().toLowerCase()).toContain(wantedEntryData[1].toLowerCase())
    })

    test('should not break if not given a prop', () => {
        wrapper = mount(EntriesRelationList)
        const component = wrapper.findComponent(EntriesRelationList)
        expect(component).toBeTruthy()
    })

    test('should not break if data changes to invalid data', async () => {
        entryData1 = {}
        await Vue.nextTick()
        const component = wrapper.findComponent(EntriesRelationList)
        expect(component).toBeTruthy()
    })

    describe('relation switch labels', () => {
        test('should change section relation between `OR` and `AND` when clicked', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const section = component.findAll('.section').at(1)
            const sectionRelationToggle = section.find('.section-relation-toggle')
            sectionRelationToggle.trigger('click')
            await Vue.nextTick()
            expect(sectionRelationToggle.text()).toEqual('OR')
            sectionRelationToggle.trigger('click')
            await Vue.nextTick()
            expect(sectionRelationToggle.text()).toEqual('AND')
        })

        test('should not change section relation if section entries contains two entries of same category', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const section = component.findAll('.section').at(0)
            const sectionRelationToggle = section.find('.section-relation-toggle')
            sectionRelationToggle.trigger('click')
            await Vue.nextTick()
            expect(sectionRelationToggle.text()).toEqual('OR')
        })

        test('should change rule relation between `OR` and `AND` when clicked', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const ruleRelationToggle = component.find('.rule-relation-toggle')
            ruleRelationToggle.trigger('click')
            await Vue.nextTick()
            expect(ruleRelationToggle.text()).toEqual('OR')
            ruleRelationToggle.trigger('click')
            await Vue.nextTick()
            expect(ruleRelationToggle.text()).toEqual('AND')
        })
    })

    describe('large data pagination', () => {
        let checkedComponent
        let checkedTable
        beforeEach(() => {
            entryData1 = {
                relation: 'and',
                entries: [
                    ['uri', '/login0'],
                    ['uri', '/login1'],
                    ['uri', '/login2'],
                    ['uri', '/login3'],
                    ['uri', '/login4'],
                    ['uri', '/login5'],
                    ['uri', '/login6'],
                    ['uri', '/login7'],
                    ['uri', '/login8'],
                    ['uri', '/login9'],
                    ['uri', '/account0'],
                    ['uri', '/account1'],
                    ['uri', '/account2'],
                    ['uri', '/account3'],
                    ['uri', '/account4'],
                    ['uri', '/account5'],
                    ['uri', '/account6'],
                    ['uri', '/account7'],
                    ['uri', '/account8'],
                    ['uri', '/account9'],
                    ['uri', '/about0'],
                    ['uri', '/about1'],
                    ['uri', '/about2'],
                    ['uri', '/about3'],
                    ['uri', '/about4'],
                    ['uri', '/about5'],
                    ['uri', '/about6'],
                    ['uri', '/about7'],
                    ['uri', '/about8'],
                    ['uri', '/about9'],
                ]
            }
            ruleData = {
                relation: 'and',
                sections: [
                    entryData1
                ]
            }
            const onUpdate = (rule) => {
                wrapper.setProps({rule: rule})
            }
            wrapper = mount(EntriesRelationList, {
                propsData: {
                    rule: ruleData,
                    editable: true
                },
                listeners: {
                    update: onUpdate
                }
            })
            checkedComponent = wrapper.findComponent(EntriesRelationList)
            checkedTable = checkedComponent.findAll('.entries-table').at(0)
        })

        test('should show 20 entries per page', () => {
            const entryRows = checkedTable.findAll('.entry-row')
            expect(entryRows.length).toEqual(20)
        })

        test('should correctly render next page when next page button is clicked', async () => {
            const nextPageButton = checkedTable.find('.pagination-next')
            nextPageButton.trigger('click')
            await Vue.nextTick()
            checkedTable = checkedComponent.findAll('.entries-table').at(0)
            const entryRows = checkedTable.findAll('.entry-row')
            expect(entryRows.length).toEqual(10)
        })

        test('should have next page button disabled if currently in last page', async () => {
            const nextPageButton = checkedTable.find('.pagination-next')
            nextPageButton.trigger('click')
            await Vue.nextTick()
            expect(nextPageButton.attributes('disabled')).toBeTruthy()
        })

        test('should correctly render prev page when next prev button is clicked', async () => {
            const nextPageButton = checkedTable.find('.pagination-next')
            nextPageButton.trigger('click')
            await Vue.nextTick()
            const prevPageButton = checkedTable.find('.pagination-previous')
            prevPageButton.trigger('click')
            await Vue.nextTick()
            checkedTable = checkedComponent.findAll('.entries-table').at(0)
            const entryRows = checkedTable.findAll('.entry-row')
            expect(entryRows.length).toEqual(20)
        })

        test('should have prev page button disabled if currently in first page', async () => {
            const prevPageButton = checkedTable.find('.pagination-previous')
            expect(prevPageButton.attributes('disabled')).toBeTruthy()
        })
    })

    describe('rule prop validator', () => {
        let validator
        beforeEach(() => {
            validator = EntriesRelationList.props.rule.validator
        })

        test('should return true for data in the correct schema', () => {
            const isValid = validator(ruleData)
            expect(isValid).toEqual(true)
        })

        test('should return false for relation not `or` or `and`', () => {
            ruleData.relation = 'unknown value'
            const isValid = validator(ruleData)
            expect(isValid).toEqual(false)
        })

        test('should return false for entries with too few arguments', () => {
            ruleData.sections[0].entries[0] = ['ok']
            const isValid = validator(ruleData)
            expect(isValid).toEqual(false)
        })

        test('should return false for entries with too many arguments', () => {
            ruleData.sections[0].entries[0] = ['ok', 'test', 'banana', 'apple', 'pear', 'eggplant']
            const isValid = validator(ruleData)
            expect(isValid).toEqual(false)
        })

        test('should return false for object entry which does not match the schema', () => {
            ruleData.sections[0].entries[0] = {
                prop: 'value'
            }
            const isValid = validator(ruleData)
            expect(isValid).toEqual(false)
        })

        test('should return false for undefined sections', () => {
            ruleData.sections = undefined
            const isValid = validator(ruleData)
            expect(isValid).toEqual(false)
        })

        test('should return false for undefined relation', () => {
            ruleData.relation = undefined
            const isValid = validator(ruleData)
            expect(isValid).toEqual(false)
        })

        test('should return false for undefined rule', () => {
            ruleData = undefined
            const isValid = validator(ruleData)
            expect(isValid).toEqual(false)
        })
    })

    describe('add section button', () => {
        test('should add empty section', () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const addSectionButton = component.find('.add-section-button')
            addSectionButton.trigger('click')
            const tables = component.findAll('.entries-table')
            expect(tables.length).toEqual(2)
        })

        test('should not have the option to add component if not editable', () => {
            wrapper = mount(EntriesRelationList, {
                propsData: {
                    rule: ruleData,
                    editable: false
                }
            })
            const component = wrapper.findComponent(EntriesRelationList)
            const addSectionButton = component.find('.add-section-button')
            expect(addSectionButton.element).toBeUndefined()
        })
    })

    describe('remove section button', () => {
        test('should remove section', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const removeSectionButton = component.find('.remove-section-button')
            removeSectionButton.trigger('click')
            await Vue.nextTick()
            const tables = wrapper.findAll('.entries-table')
            expect(tables.length).toEqual(1)
        })

        test('should not have the option to remove top level component', () => {
            ruleData.sections = []
            wrapper = mount(EntriesRelationList, {
                propsData: {
                    rule: ruleData,
                    editable: true
                }
            })
            const component = wrapper.findComponent(EntriesRelationList)
            const removeSectionButton = component.find('.remove-section-button')
            expect(removeSectionButton.element).toBeUndefined()
        })

        test('should not have the option to remove component if not editable', () => {
            wrapper = mount(EntriesRelationList, {
                propsData: {
                    rule: ruleData,
                    editable: false
                }
            })
            const component = wrapper.findComponent(EntriesRelationList)
            const removeSectionButton = component.find('.remove-section-button')
            expect(removeSectionButton.element).toBeUndefined()
        })

        test('should close new entry table after removing section', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            const removeSectionButton = component.find('.remove-section-button')
            removeSectionButton.trigger('click')
            await Vue.nextTick()
            const newEntryTable = component.find('.new-entry-table')
            expect(newEntryTable.element).toBeUndefined()
        })
    })

    describe('remove all sections button', () => {
        test('should remove section', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const removeAllSectionsButton = component.find('.remove-all-sections-button')
            removeAllSectionsButton.trigger('click')
            await Vue.nextTick()
            const tables = wrapper.findAll('.entries-table')
            expect(tables.length).toEqual(0)
        })

        test('should not have the option to remove component if not editable', () => {
            wrapper = mount(EntriesRelationList, {
                propsData: {
                    rule: ruleData,
                    editable: false
                }
            })
            const component = wrapper.findComponent(EntriesRelationList)
            const removeAllSectionsButton = component.find('.remove-all-sections-button')
            expect(removeAllSectionsButton.element).toBeUndefined()
        })
    })

    describe('add entry button', () => {
        test('should open new entry table', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            const newEntryTable = component.find('.new-entry-table')
            expect(newEntryTable.element).toBeDefined()
        })

        test('should add new entry from input when confirm button is clicked', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            const newEntryTable = component.find('.new-entry-table')
            const newEntryTextarea = newEntryTable.find('.new-entry-textarea')
            newEntryTextarea.setValue('1.2.3.4#annotation')
            const confirmAddEntryButton = component.find('.confirm-add-entry-button')
            confirmAddEntryButton.trigger('click')
            await Vue.nextTick()
            expect(wrapper.vm.rule.sections[0].entries.length).toEqual(3)
            expect(wrapper.vm.rule.sections[0].entries[0]).toEqual(['ip', '1.2.3.4', 'annotation'])
        })

        test('should add multiple new entries from input when confirm button is clicked', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            const newEntryTable = component.find('.new-entry-table')
            const newEntryTextarea = newEntryTable.find('.new-entry-textarea')
            newEntryTextarea.setValue('1.2.3.4#annotation\n127.0.0.1#localhost')
            const confirmAddEntryButton = component.find('.confirm-add-entry-button')
            confirmAddEntryButton.trigger('click')
            await Vue.nextTick()
            expect(wrapper.vm.rule.sections[0].entries.length).toEqual(4)
            expect(wrapper.vm.rule.sections[0].entries[0]).toEqual(['ip', '127.0.0.1', 'localhost'])
            expect(wrapper.vm.rule.sections[0].entries[1]).toEqual(['ip', '1.2.3.4', 'annotation'])
        })

        test('should add new entries from multi-line input when confirm button is clicked', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            const newEntryTable = component.find('.new-entry-table')
            const typeSelection = newEntryTable.find('.new-entry-type-selection')
            typeSelection.trigger('click')
            const options = typeSelection.findAll('option')
            options.at(7).element.selected = true
            typeSelection.trigger('change')
            await Vue.nextTick()
            const newEntryTextarea = newEntryTable.find('.new-entry-textarea')
            newEntryTextarea.setValue('something\nright\nhere')
            const confirmAddEntryButton = component.find('.confirm-add-entry-button')
            confirmAddEntryButton.trigger('click')
            await Vue.nextTick()
            expect(wrapper.vm.rule.sections[0].entries.length).toEqual(3)
            expect(wrapper.vm.rule.sections[0].entries[0]).toEqual(['headers', ['something', 'right'], 'here'])
        })

        test('should not add new entries from multi-line input when confirm button is clicked if has too few lines', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            const newEntryTable = component.find('.new-entry-table')
            const typeSelection = newEntryTable.find('.new-entry-type-selection')
            typeSelection.trigger('click')
            const options = typeSelection.findAll('option')
            options.at(7).element.selected = true
            typeSelection.trigger('change')
            await Vue.nextTick()
            const newEntryTextarea = newEntryTable.find('.new-entry-textarea')
            newEntryTextarea.setValue('something')
            const confirmAddEntryButton = component.find('.confirm-add-entry-button')
            confirmAddEntryButton.trigger('click')
            await Vue.nextTick()
            expect(wrapper.vm.rule.sections[0].entries.length).toEqual(2)
        })

        test('should not add new entries from multi-line input when confirm button is clicked if has too many lines', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            const newEntryTable = component.find('.new-entry-table')
            const typeSelection = newEntryTable.find('.new-entry-type-selection')
            typeSelection.trigger('click')
            const options = typeSelection.findAll('option')
            options.at(7).element.selected = true
            typeSelection.trigger('change')
            await Vue.nextTick()
            const newEntryTextarea = newEntryTable.find('.new-entry-textarea')
            newEntryTextarea.setValue('something\n1\n2\n3\n4\n5\n6')
            const confirmAddEntryButton = component.find('.confirm-add-entry-button')
            confirmAddEntryButton.trigger('click')
            await Vue.nextTick()
            expect(wrapper.vm.rule.sections[0].entries.length).toEqual(2)
        })

        test('should not show new entry button if not editable', () => {
            wrapper = mount(EntriesRelationList, {
                propsData: {
                    rule: ruleData,
                    editable: false
                }
            })
            const component = wrapper.findComponent(EntriesRelationList)
            const addEntryButton = component.find('.add-entry-button')
            expect(addEntryButton.element).toBeUndefined()
        })

        test('should set section relation to `OR` if two items of same category added', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            // remove all entries
            let removeEntryButton = component.find('.remove-entry-button')
            removeEntryButton.trigger('click')
            await Vue.nextTick()
            removeEntryButton = component.find('.remove-entry-button')
            removeEntryButton.trigger('click')
            await Vue.nextTick()
            // set relation to AND
            const sectionRelationToggle = component.findAll('.section-relation-toggle').at(0)
            sectionRelationToggle.trigger('click')
            await Vue.nextTick()
            expect(sectionRelationToggle.text()).toEqual('AND')
            // open new entry table
            const addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            // add input to new entry table
            const newEntryTable = component.find('.new-entry-table')
            const newEntryTextarea = newEntryTable.find('.new-entry-textarea')
            newEntryTextarea.setValue('1.2.3.4#annotation\n1.2.3.5#wow')
            // confirm add new entry
            const confirmAddEntryButton = component.find('.confirm-add-entry-button')
            confirmAddEntryButton.trigger('click')
            await Vue.nextTick()
            // check
            expect(sectionRelationToggle.text()).toEqual('OR')
        })

        test('should not set section relation to `OR` if no more than one item of same category added', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            // remove all entries
            let removeEntryButton = component.find('.remove-entry-button')
            removeEntryButton.trigger('click')
            await Vue.nextTick()
            removeEntryButton = component.find('.remove-entry-button')
            removeEntryButton.trigger('click')
            await Vue.nextTick()
            // set relation to AND
            const sectionRelationToggle = component.findAll('.section-relation-toggle').at(0)
            sectionRelationToggle.trigger('click')
            await Vue.nextTick()
            expect(sectionRelationToggle.text()).toEqual('AND')
            // open new entry table
            const addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            // add input to new entry table
            const newEntryTable = component.find('.new-entry-table')
            const newEntryTextarea = newEntryTable.find('.new-entry-textarea')
            newEntryTextarea.setValue('1.2.3.4#annotation')
            // confirm add new entry
            const confirmAddEntryButton = component.find('.confirm-add-entry-button')
            confirmAddEntryButton.trigger('click')
            await Vue.nextTick()
            // check
            expect(sectionRelationToggle.text()).toEqual('AND')
        })

        test('should not set section relation to `OR` if two headers added', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            // remove all entries
            let removeEntryButton = component.find('.remove-entry-button')
            removeEntryButton.trigger('click')
            await Vue.nextTick()
            removeEntryButton = component.find('.remove-entry-button')
            removeEntryButton.trigger('click')
            await Vue.nextTick()
            // set relation to AND
            const sectionRelationToggle = component.findAll('.section-relation-toggle').at(0)
            sectionRelationToggle.trigger('click')
            await Vue.nextTick()
            expect(sectionRelationToggle.text()).toEqual('AND')
            // open new entry table
            let addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            let newEntryTable = component.find('.new-entry-table')
            // change entry type to headers
            let typeSelection = newEntryTable.find('.new-entry-type-selection')
            typeSelection.trigger('click')
            let options = typeSelection.findAll('option')
            options.at(7).element.selected = true
            typeSelection.trigger('change')
            await Vue.nextTick()
            // add input to new entry table
            let newEntryTextarea = newEntryTable.find('.new-entry-textarea')
            newEntryTextarea.setValue('something\nright\nhere')
            // confirm add new entry
            let confirmAddEntryButton = component.find('.confirm-add-entry-button')
            confirmAddEntryButton.trigger('click')
            await Vue.nextTick()
            // open new entry table - second time
            addEntryButton = component.find('.add-entry-button')
            addEntryButton.trigger('click')
            await Vue.nextTick()
            newEntryTable = component.find('.new-entry-table')
            // change entry type to headers - second time
            typeSelection = newEntryTable.find('.new-entry-type-selection')
            typeSelection.trigger('click')
            options = typeSelection.findAll('option')
            options.at(7).element.selected = true
            typeSelection.trigger('change')
            await Vue.nextTick()
            // add input to new entry table - second time
            newEntryTextarea = newEntryTable.find('.new-entry-textarea')
            newEntryTextarea.setValue('something\nright\nhere')
            // confirm add new entry - second time
            confirmAddEntryButton = component.find('.confirm-add-entry-button')
            confirmAddEntryButton.trigger('click')
            await Vue.nextTick()
            // check
            expect(sectionRelationToggle.text()).toEqual('AND')
        })
    })

    describe('remove entry button', () => {
        test('should remove entry', async () => {
            const component = wrapper.findComponent(EntriesRelationList)
            const removeEntryButton = component.find('.remove-entry-button')
            removeEntryButton.trigger('click')
            await Vue.nextTick()
            expect(wrapper.vm.rule.sections[0].entries.length).toEqual(1)
        })
    })
})
