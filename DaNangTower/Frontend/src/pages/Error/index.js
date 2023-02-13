import { TitleTab } from '../../utils/GenerateTitle';
import './error.scss';
function Error() {
    TitleTab('Lỗi trang');
    return (
        <div>
            <h2> Page not found</h2>
        </div>
    );
}

export default Error;
