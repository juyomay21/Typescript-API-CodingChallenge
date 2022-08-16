import {useAppDispatch} from "@/hooks/redux";
import {fetchClasses} from "@/store/actions/classes";
import {classesSelector} from "@/store/selectors/classes";
import {userSelector} from "@/store/selectors/user";
import {Class} from "@/types/models";
import React from "react";
import {useSelector} from "react-redux";
import {ScreenError} from "./ScreenError";
import {ScreenLoader} from "./ScreenLoader";

export const UserClasses: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useSelector(userSelector);
    const classes = useSelector(classesSelector);

    React.useEffect(() => {
        if (! user.data) {
            return;
        }

        const {dispatcher, abort} = fetchClasses(user.data.classIDs);
        dispatch(dispatcher);
        
        return () => abort();
    }, [dispatch, user]);

    return (
        <div className="centered" data-testid="user-classes-view">
            {classes.isLoading && <ScreenLoader />} 
            {classes.error && <ScreenError message={classes.error} />} 
            {classes.data && (
                classes.data.map(item => <ClassBox key={item.id} data={item} />)
            )}
        </div>
    );
};

interface ClassProps {
    readonly data: Class;
}

const ClassBox: React.FC<ClassProps> = (props) => {
    const { data } = props;

    const studentNames = React.useMemo(() =>
        data.students.map(({ name }) => name).join(", "), [data.students]);

    return (
        <div className="class-entry">
            <div><b>Name</b></div>
            <span>{data.name}</span>
            <div><b>Students</b></div>
            <span>{studentNames}</span>
        </div>
    );
};
