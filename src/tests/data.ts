import {IDStr, User} from "@/types/models";
import faker from "@faker-js/faker";
import {AirTableClassFields, AirTableDataRecord, AirTableStudentFields} from "@/types/api";

export const mockAirtableStudent = (classIDs?: ReadonlyArray<IDStr>): AirTableDataRecord<AirTableStudentFields> => {

    return {
        id: faker.datatype.uuid(),
        createdTime: faker.date.past().toISOString(),
        fields: {
            Name: faker.name.findName(),
            Classes: classIDs || Array.from({ length: faker.datatype.number({ min: 1, max: 4 }) }).map(() => faker.name.jobTitle()),
        },
    };
};

export const mockAirtableClass = (studentIDs?: ReadonlyArray<IDStr>): AirTableDataRecord<AirTableClassFields> => {
    return {
        id: faker.datatype.uuid(),
        createdTime: faker.date.past().toISOString(),
        fields: {
            Name: faker.unique(faker.lorem.sentence),
            Students: studentIDs || Array.from({ length: faker.datatype.number({ min: 1, max: 4 }) }).map(() => faker.name.findName()),
        },
    };
};

export const mockStudent = (classIDs?: ReadonlyArray<string>): User => {
    const student = mockAirtableStudent(classIDs);

    return {
        id: student.id,
        name: student.fields.Name,
        classIDs: student.fields.Classes,
    };
};
