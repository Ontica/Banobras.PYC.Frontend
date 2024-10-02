/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { DateString, DateStringLibrary } from '@app/core';

import { ArrayLibrary } from '@app/shared/utils';

import { DefaultEndDate, Step, WorkflowGroups } from '@app/models';

const UNDEFINED_DEADLINE = 'N/D';


interface StepsGroupData {
  groupUID: string;
  groupName: string;
  groupDate?: DateString;
  steps?: Step[];
}

@Pipe({
  name: 'empPYCRequestStepsGroupBy'
})
export class RequestStepsGroupByPipe implements PipeTransform {

  transform(steps: Step[] = [], groupBy: WorkflowGroups): StepsGroupData[] {
    const stepsGroup: StepsGroupData[] = [];

    steps.forEach((step) => {
      const groupUID = this.getGroupUID(step, groupBy);
      const groupExists: boolean = this.getIfGroupExists(groupUID, stepsGroup);
      const group: StepsGroupData = groupExists ? this.getExistingGroup(groupUID, stepsGroup) :
        this.getGroupFromStep(groupUID, step, groupBy);

      if (!groupExists) {
        stepsGroup.push(group);
      }

      group.steps.push(step);
    });

    return this.getSortedGroups(stepsGroup, groupBy);
  }


  private getGroupUID(step: Step, groupBy: WorkflowGroups): string {
    switch (groupBy) {
      case WorkflowGroups.process:
        return step.workflowInstance.uid;
      case WorkflowGroups.deadline:
        const groupUID = step.dueTime.toString().split('T')[0];
        return groupUID || UNDEFINED_DEADLINE;
      case WorkflowGroups.all:
      default:
        return 'all';
    }
  }


  private getIfGroupExists(groupUID: string, stepsGroup: StepsGroupData[]): boolean {
    return stepsGroup.some(group => group.groupUID === groupUID);
  }


  private getExistingGroup(groupUID: string, stepsGroup: StepsGroupData[]): StepsGroupData {
    return stepsGroup.find(group => group.groupUID === groupUID);
  }


  private getGroupFromStep(groupUID: string, step: Step, groupBy: WorkflowGroups): StepsGroupData {
    return {
      groupUID,
      groupName: this.getGroupName(groupUID, step, groupBy),
      groupDate: this.getGroupDate(groupUID, groupBy),
      steps: []
    };
  }


  private getSortedGroups(stepsGroup: StepsGroupData[], groupBy: WorkflowGroups): StepsGroupData[] {
    switch (groupBy) {
      case WorkflowGroups.process:
        return ArrayLibrary.sortByKey(stepsGroup, 'groupName');
      case WorkflowGroups.deadline:
        return ArrayLibrary.sortByKey(stepsGroup, 'groupDate');;
      case WorkflowGroups.all:
      default:
        return stepsGroup;
    }
  }


  private getGroupName(groupUID: string, step: Step, groupBy: WorkflowGroups): string {
    switch (groupBy) {
      case WorkflowGroups.process:
        return step.workflowInstance.name;
      case WorkflowGroups.deadline:
        const isUndefinedDeadline = groupUID === UNDEFINED_DEADLINE;
        return isUndefinedDeadline ? 'Fecha límite no definida' : DateStringLibrary.format(groupUID);
      case WorkflowGroups.all:
      default:
        return 'Todas las tareas';
    }
  }


  private getGroupDate(groupUID: string, groupBy: WorkflowGroups): DateString {
    switch (groupBy) {
      case WorkflowGroups.deadline:
        const isUndefinedDeadline = groupUID === UNDEFINED_DEADLINE;
        return DateStringLibrary.toDate(isUndefinedDeadline ? DefaultEndDate : groupUID);
      case WorkflowGroups.all:
      default:
        return null;
    }
  }

}
